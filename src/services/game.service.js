const Game = require("./../models/game.model");
const Card = require("./../models/card.model");
const CustomError = require("./../utils/custom-error");
const ObjectId = require("mongoose").Types.ObjectId;

class GameService {
  // Create Game
  async create(data, user) {
    // Check at least 1 card is available in the database.
    const cardsCount = await Card.find({}).limit(1).size();

    if (cardsCount.length === 0) throw new CustomError("No card in the database");

    // Get a random card from the database
    const randomCard = await Card.aggregate([
      { $match: { isDeleted: false } },
      { $sample: { size: 1 } },
      { $project: { _id: 1 } }
    ]);

    // Create Game with random card
    const game = await new Game({
      userId: user._id,
      cards: randomCard
    }).save();

    // Return Cards populated
    return await game.populate("cards");
  }

  // New Card
  async newCard(gameId) {
    if (!ObjectId.isValid(gameId)) throw new CustomError("Game does not exist");

    const game = await Game.findOne({ _id: gameId }).populate(
      "userId noCards yesCards",
      "-__v"
    );
    if (!game) throw new CustomError("Game does not exist");

    // Extract #hashtags from yesCards
    const yesCardsHashtags = [];
    game.yesCards.forEach(card => card.hashtags.forEach(hashtag => yesCardsHashtags.push(hashtag)));

    // Extract #hashtags from noCards
    const noCardsHashtags = [];
    game.noCards.forEach(card => card.hashtags.forEach(hashtag => noCardsHashtags.push(hashtag)));

    // Get a random card from the database that does not have any of the same hashtags as the noCards and has not been used in the game
    const newRandomCard = await Card.aggregate([
      { $match: { isDeleted: false, _id: { $nin: game.cards.map((card) => card._id) }, hashtags: { $nin: noCardsHashtags } } },
      { $sample: { size: 1 } },
    ]);

    if (newRandomCard.length === 0) throw new CustomError("All cards have been used");

    // Add the new card to the game
    game.cards.push(newRandomCard[0]._id);
    await game.save();

    // Return the new random card
    return {
      newCard: newRandomCard
    };
  }

  // Get All Games in the Database
  async getAll() {
    return await Game.find({}, { __v: 0 }).populate(
      "userId cards noCards yesCards",
      "-userId -__v"
    );
  }

  async getOne(gameId) {
    if (!ObjectId.isValid(gameId)) throw new CustomError("Game does not exist");

    const game = await Game.findOne({ _id: gameId }).populate(
      "userId cards noCards yesCards",
      "-__v"
    );
    if (!game) throw new CustomError("Game does not exist");

    return game;
  }

  async addNoCard(gameId, data) {
    if (!data.cardId) throw new CustomError("Card Id is required");

    const game = await Game.findOneAndUpdate(
      { _id: gameId },
      { $push: { noCards: { $each: [data.cardId], $position: 0 } } },
      { new: true }
    ).populate("userId cards noCards yesCards", "-__v");

    if (!game) throw new CustomError("Game does not exist");

    return game;
  }

  async addYesCard(gameId, data) {
    if (!data.cardId) throw new CustomError("Card Id is required");

    const game = await Game.findOneAndUpdate(
      { _id: gameId },
      {
        $push: {
          yesCards: { $each: [data.cardId], $position: 0 },
          eloScores: 1500
        }
      },
      { new: true }
    ).populate("userId cards noCards yesCards", "-__v");

    if (!game) throw new CustomError("Game does not exist");

    return game;
  }

  async updateYesCards(gameId, data) {
    if (!data.cardIds) throw new CustomError("card Ids are required");
    if (!data.eloScores)
      throw new CustomError("Elo Rating Scores are required");

    const game = await Game.findOneAndUpdate(
      { _id: gameId },
      { $set: { yesCards: data.cardIds, eloScores: data.eloScores } },
      { new: true }
    ).populate("userId cards noCards yesCards", "-__v");

    if (!game) throw new CustomError("Game does not exist");

    return game;
  }

  // Get All Games in the Database By User
  async getAllByUser(user) {
    return await Game.find({ userId: user._id }, { __v: 0 }).populate(
      "cards noCards yesCards",
      "-userId -__v"
    );
  }
}

module.exports = new GameService();
