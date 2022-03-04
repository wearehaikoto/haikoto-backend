const Game = require("./../models/game.model");
const Card = require("./../models/card.model");
const Organisation = require("./../models/organisation.model");
const CustomError = require("./../utils/custom-error");
const ObjectId = require("mongoose").Types.ObjectId;

class GameService {
    async create(data, user) {
        const checkIfCanContinue = await this.checkIfNewCardForGame(user._id);

        if (!checkIfCanContinue) throw new CustomError("You have already played all the cards");

        // Check if the user has and oldGame
        const oldGame = await Game.findOne({ userId: user._id });

        // return the old game if it exists
        if (oldGame) return { ...oldGame.toObject(), continue: true };

        // Create Game with userId if no oldGame
        const game = await new Game({
            userId: user._id
        }).save();

        // Return Cards populated
        return { ...game.toObject(), continue: false };
    }

    async checkIfNewCardForGame(user) {
        // await Game.deleteMany({ }); // for easy testing delete all everytime

        const game = await Game.findOne({ userId: user._id });

        // If there is no game for the user, return true
        if (!game) return true;

        // If there is a game for the user, check if there are any cards left
        let newCard = false;
        let newHashtag = false;

        // If there are no cards left, return true
        try {
            newCard = await this.newCard(game._id);
        } catch (error) {
            /*do nothing*/
        }

        try {
            newHashtag = await this.newHashtag(user, game._id);
        } catch (error) {
            /*do nothing*/
        }

        if (!newCard && !newHashtag) return false;

        // Return true if there is a new card or hashtag to play
        return true;
    }

    async newCard(gameId) {
        if (!ObjectId.isValid(gameId)) throw new CustomError("Game does not exist");

        const game = (await Game.find({ _id: gameId }))[0];
        if (!game) throw new CustomError("Game does not exist");

        // Get a random card from the database that
        // is not a parent card
        // not have any of the same hashtags as the leftSwipedHashtags but
        // has rightSwipedHashtags,
        // has not been used in the game,
        const newRandomCard = await Card.aggregate([
            {
                $match: {
                    isDeleted: false,
                    isParent: false,
                    _id: {
                        $nin: game.rightSwipedCards.concat(game.leftSwipedCards)
                    },
                    hashtags: {
                        $nin: game.leftSwipedHashtags,
                        $in: game.rightSwipedHashtags
                    }
                }
            },
            { $sample: { size: 1 } }
        ]);

        if (newRandomCard.length === 0) throw new CustomError("All cards have been used");

        // Populate the newRandomcard Hashtags
        await Card.populate(newRandomCard, { path: "hashtags" });

        // Return the new random card
        return {
            newCard: newRandomCard
        };
    }

    async newHashtag(user, gameId) {
        if (!ObjectId.isValid(gameId)) throw new CustomError("Game does not exist");

        const game = (await Game.find({ _id: gameId }))[0];
        if (!game) throw new CustomError("Game does not exist");

        const query = {
            $nin: game.leftSwipedHashtags.concat(game.rightSwipedHashtags)
        };

        // Check if user is attached to an organisation
        if (user.organisation) {
            const organisation = await Organisation.findOne({
                _id: user.organisation
            });

            // If the user is attached to an organisation, get all the hashtags
            query["$in"] = organisation.hashtags.map((h) => h._id);
        }

        // Get a random card from the Card model that does not have any of the same id with the leftSwipedHashtags or rightSwipedHashtags and has not hashTags
        const newRandomHashtag = await Card.aggregate([
            {
                $match: {
                    isDeleted: false,
                    isParent: true,
                    _id: query
                }
            },
            { $sample: { size: 1 } }
        ]);

        if (newRandomHashtag.length === 0) throw new CustomError("All hashtags have been used");

        // Return the new random hashtag
        return {
            newHashtag: newRandomHashtag[0]
        };
    }

    async getAll() {
        return await Game.find({}, { __v: 0 }).populate("userId leftSwipedCards rightSwipedCards", "-userId -__v");
    }

    async getOne(gameId) {
        if (!ObjectId.isValid(gameId)) throw new CustomError("Game does not exist");

        const game = await Game.findOne({ _id: gameId });
        if (!game) throw new CustomError("Game does not exist");

        return game;
    }

    async addLeftSwipedCard(gameId, data) {
        if (!data.cardId) throw new CustomError("Card Id is required");

        const game = await Game.findOneAndUpdate({ _id: gameId }, { $push: { leftSwipedCards: { $each: [data.cardId], $position: 0 } } }, { new: true });

        if (!game) throw new CustomError("Game does not exist");

        return game;
    }

    async addRightSwipedCard(gameId, data) {
        if (!data.cardId) throw new CustomError("Card Id is required");

        const game = await Game.findOneAndUpdate(
            { _id: gameId },
            {
                // $push: {
                //   rightSwipedCards: { $each: [data.cardId], $position: 0 },
                //   eloScores: 1500
                // }
                $push: { rightSwipedCards: data.cardId, eloScores: 1500 }
            },
            { new: true }
        );

        if (!game) throw new CustomError("Game does not exist");

        return game;
    }

    async addLeftSwipedHashtag(gameId, data) {
        if (!data.hashtagId) throw new CustomError("Hashtag Id is required");

        const game = await Game.findOneAndUpdate({ _id: gameId }, { $push: { leftSwipedHashtags: data.hashtagId } }, { new: true });

        if (!game) throw new CustomError("Game does not exist");

        return game;
    }

    async addRightSwipedHashtag(gameId, data) {
        if (!data.hashtagId) throw new CustomError("Hashtag Id is required");

        const game = await Game.findOneAndUpdate({ _id: gameId }, { $push: { rightSwipedHashtags: data.hashtagId } }, { new: true });

        if (!game) throw new CustomError("Game does not exist");

        return game;
    }

    async updateRightSwipedCards(gameId, data) {
        if (!data.cardIds) throw new CustomError("card Ids are required");
        if (!data.eloScores) throw new CustomError("Elo Rating Scores are required");

        const game = await Game.findOneAndUpdate({ _id: gameId }, { $set: { rightSwipedCards: data.cardIds, eloScores: data.eloScores } }, { new: true });

        if (!game) throw new CustomError("Game does not exist");

        return game;
    }

    async getAllByUser(user) {
        return await Game.findOne({ userId: user._id }, { __v: 0 });
    }
}

module.exports = new GameService();
