const Game = require("./../models/game.model");
const Card = require("./../models/card.model");
const CustomError = require("./../utils/custom-error");
const ObjectId = require("mongoose").Types.ObjectId;

class GameService {
  // Create Game
  async create(data, user) {
    // Logic to play game with a number of cards specified by user
    // // Validation check
    // if (!data.numberOfCards) throw new CustomError("Number of Cards is required");

    // // Check if cards are available in the database
    // const cards = await Card.find({}).limit(data.numberOfCards).size();
    // if (cards.length < data.numberOfCards)
    //     throw new CustomError(
    //         `Sorry we don't have up to ${data.numberOfCards} cards in the database yet`
    //     );

    // // Get random cards
    // const randomCards = await Card.aggregate([
    //     { $sample: { size: data.numberOfCards } },
    //     { $project: { _id: 1 } }
    // ]);

    // Logic to get all cards in the db for a game in random order
    // Get number of cards available in the database
    const cards = await Card.find({ isDeleted: false }).count();

    // Get random cards
    const randomCards = await Card.aggregate([
      { $match: { isDeleted: false } },
      { $sample: { size: cards } },
      { $project: { _id: 1 } }
    ]);

    // Create Game with random cards
    const game = await new Game({
      userId: user._id,
      cards: randomCards
    }).save();

    // Return Cards populated
    return await game.populate("cards");
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
      { $push: { noCards: data.cardId } },
      { new: true }
    ).populate("userId cards noCards yesCards", "-__v");

    if (!game) throw new CustomError("Game does not exist");

    return game;
  }

  async addYesCard(gameId, data) {
    if (!data.cardId) throw new CustomError("Card Id is required");

    const game = await Game.findOneAndUpdate(
      { _id: gameId },
      { $push: { yesCards: data.cardId, eloScores: 1500 } },
      { new: true }
    ).populate("userId cards noCards yesCards", "-__v");

    if (!game) throw new CustomError("Game does not exist");

    return game;
  }

  async updateYesCards(gameId, data) {
    if (!data.cardIds) throw new CustomError("card Ids are required");
    if (!data.eloScores) throw new CustomError("Elo Rating Scores are required");

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
