const Game = require("./../models/game.model");
const Card = require("./../models/card.model");
const Hashtag = require("./../models/hashtag.model");
const CustomError = require("./../utils/custom-error");
const ObjectId = require("mongoose").Types.ObjectId;

class GameService {
  async create(data, user) {
    // Create Game with userId
    const game = await new Game({
      userId: user._id
    }).save();

    // Return Cards populated
    return {
      ...game,
      continue: true
    };
  }

  async checkIfNewCardForGame(user) {
    const game = await Game.findOne({ userId: user._id });

    // If there is no game for the user, return true
    if (!game) return true;

    // If there is a game for the user, check if there are any cards left
    let newCard = false;
    let newHashtag = false;

    // If there are no cards left, return true
    try {
      newCard = await this.newCard(game._id, true);
    } catch (error) {
      /*do nothing*/
    }

    try {
      newHashtag = await this.newHashtag(game._id);
    } catch (error) {
      /*do nothing*/
    }

    if (!newCard && !newHashtag) return false;

    // Return true if there is a new card or hashtag to play
    return true;
  }

  async newCard(gameId, fromGameService) {
    if (!ObjectId.isValid(gameId)) throw new CustomError("Game does not exist");

    const game = await Game.findOne({ _id: gameId }).populate(
      "userId leftSwipedCards rightSwipedCards",
      "-__v"
    );
    if (!game) throw new CustomError("Game does not exist");

    // Get a random card from the database that does not have any of the same hashtags as the leftSwipedHashtags but has rightSwipedHashtags and has not been used in the game
    const newRandomCard = await Card.aggregate([
      {
        $match: {
          isDeleted: false,
          _id: { $nin: game.cards.map((card) => card._id) },
          hashtags: {
            $nin: game.leftSwipedHashtags.toString().split(","),
            $in: game.rightSwipedHashtags.toString().split(",")
          }
        }
      },
      { $sample: { size: 1 } }
    ]);

    if (newRandomCard.length === 0)
      throw new CustomError("All cards have been used");

    // Populate the newRandomcard Hashtags
    await Card.populate(newRandomCard, { path: "hashtags" });

    // Don't save the card if this function is called from the game service
    if (!fromGameService) {
      // Add the new card to the game
      game.cards.push(newRandomCard[0]._id);
      await game.save();
    }

    // Return the new random card
    return {
      newCard: newRandomCard
    };
  }

  async newHashtag(gameId) {
    if (!ObjectId.isValid(gameId)) throw new CustomError("Game does not exist");

    const game = await Game.findOne({ _id: gameId });
    if (!game) throw new CustomError("Game does not exist");

    // Get a random hashtag from the Hashtag model that does not have any of the same hashtags as the leftSwipedHashtags or rightSwipedHashtags
    const newRandomHashtag = await Hashtag.aggregate([
      {
        $match: {
          isDeleted: false,
          _id: {
            $nin: game.leftSwipedHashtags.concat(game.rightSwipedHashtags)
          }
        }
      },
      { $sample: { size: 1 } }
    ]);

    if (newRandomHashtag.length === 0)
      throw new CustomError("All hashtags have been used");

    // Return the new random hashtag
    return {
      newHashtag: newRandomHashtag[0]
    };
  }

  async getAll() {
    return await Game.find({}, { __v: 0 }).populate(
      "userId cards leftSwipedCards rightSwipedCards",
      "-userId -__v"
    );
  }

  async getOne(gameId) {
    if (!ObjectId.isValid(gameId)) throw new CustomError("Game does not exist");

    const game = await Game.findOne({ _id: gameId })
      .populate("userId", "codeName")
      .populate({
        path: "cards leftSwipedCards rightSwipedCards",
        populate: { path: "hashtags" }
      });

    if (!game) throw new CustomError("Game does not exist");

    return game;
  }

  async addLeftSwipedCard(gameId, data) {
    if (!data.cardId) throw new CustomError("Card Id is required");

    const game = await Game.findOneAndUpdate(
      { _id: gameId },
      { $push: { leftSwipedCards: { $each: [data.cardId], $position: 0 } } },
      { new: true }
    );

    if (!game) throw new CustomError("Game does not exist");

    return game;
  }

  async addRightSwipedCard(gameId, data) {
    if (!data.cardId) throw new CustomError("Card Id is required");

    const game = await Game.findOneAndUpdate(
      { _id: gameId },
      {
        $push: {
          rightSwipedCards: { $each: [data.cardId], $position: 0 },
          eloScores: 1500
        }
      },
      { new: true }
    );

    if (!game) throw new CustomError("Game does not exist");

    return game;
  }

  async addLeftSwipedHashtag(gameId, data) {
    if (!data.hashtagId) throw new CustomError("Hashtag Id is required");

    const game = await Game.findOneAndUpdate(
      { _id: gameId },
      { $push: { leftSwipedHashtags: data.hashtagId } },
      { new: true }
    );

    if (!game) throw new CustomError("Game does not exist");

    return game;
  }

  async addRightSwipedHashtag(gameId, data) {
    if (!data.hashtagId) throw new CustomError("Hashtag Id is required");

    const game = await Game.findOneAndUpdate(
      { _id: gameId },
      { $push: { rightSwipedHashtags: data.hashtagId } },
      { new: true }
    );

    if (!game) throw new CustomError("Game does not exist");

    return game;
  }

  async updateRightSwipedCards(gameId, data) {
    if (!data.cardIds) throw new CustomError("card Ids are required");
    if (!data.eloScores)
      throw new CustomError("Elo Rating Scores are required");

    const game = await Game.findOneAndUpdate(
      { _id: gameId },
      { $set: { rightSwipedCards: data.cardIds, eloScores: data.eloScores } },
      { new: true }
    );

    if (!game) throw new CustomError("Game does not exist");

    return game;
  }

  async getAllByUser(user) {
    return await Game.find({ userId: user._id }, { __v: 0 }).populate(
      "cards leftSwipedCards rightSwipedCards",
      "-userId -__v"
    );
  }
}

module.exports = new GameService();
