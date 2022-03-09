const userService = require("./user.service");
const Card = require("./../models/card.model");
const Game = require("./../models/game.model");
const CustomError = require("./../utils/custom-error");

class GameService {
    async create(userId) {
        const checkIfCanContinue = await this.checkIfNewCardForGame(userId);
        if (!checkIfCanContinue) throw new CustomError("you have already played all the cards");

        // Check if the user has and oldGame
        const oldGame = await this.getOneByUser(userId).catch((e) => console.log("user does not have oldGame", e.message));
        if (oldGame) return { ...oldGame.toObject(), continue: true };

        // Create Game with userId if no oldGame
        const game = await new Game({ user: userId }).save();
        return { ...game.toObject(), continue: false };
    }

    async getAll() {
        return await Game.find({ isDeleted: false });
    }

    async getOneByUser(userId) {
        return await Game.findOne({ user: userId, isDeleted: false });
    }

    async getAllByUser(userId) {
        return await Game.find({ user: userId, isDeleted: false });
    }

    async checkIfNewCardForGame(userId) {
        // await Game.deleteMany({}); // for easy testing delete all everytime

        // If there is no game for the user, return true
        const game = await this.getOneByUser(userId).catch((e) => console.log("user does not have oldGame", e.message));
        if (!game) return true;

        // If there is a game for the user, check if there are any cards left
        const newCard = await this.newCard(game._id).catch((e) => console.log("no new card is available", e.message));
        const newHashtag = await this.newHashtag(game._id, userId).catch((e) => console.log("no new hashtag is available", e.message));

        if (!newCard && !newHashtag) return false;

        // Return true if there is a new card or hashtag to play
        return true;
    }

    async getOne(gameId) {
        const game = await Game.findOne({ _id: gameId });
        if (!game) throw new CustomError("game does not exist", 404);
        return game;
    }

    async newCard(gameId) {
        const game = await this.getOne(gameId);

        // Get a random card from the database that
        // - is not a parent card
        // - does not have a hashtag in leftSwipedHashtags
        // - have a card in rightSwipedHashtags,
        // - has not been used in the game.
        const newRandomCard = await Card.aggregate([
            {
                $match: {
                    isParent: false,
                    isDeleted: false,
                    hashtags: {
                        $nin: game.leftSwipedHashtags,
                        $in: game.rightSwipedHashtags
                    },
                    _id: {
                        $nin: game.leftSwipedCards
                            .map((c) => c._id)
                            .concat(game.rightSwipedCards)
                            .map((c) => c._id)
                    }
                }
            },
            { $sample: { size: 1 } }
        ]);

        if (newRandomCard.length === 0) throw new CustomError("all cards have been played");

        // Populate the card hashtags
        await Card.populate(newRandomCard, { path: "hashtags" });

        // Return the card
        return newRandomCard[0];
    }

    async newHashtag(gameId, userId) {
        const game = await this.getOne(gameId);
        const user = await userService.getOne(userId);

        // Query build up
        const query = {
            $nin: game.leftSwipedHashtags
                .map((c) => c._id)
                .concat(game.rightSwipedHashtags)
                .map((c) => c._id)
        };

        // Check if the user is attached to an organisation and get all the organisation hashtags
        if (user.organisation) query["$in"] = user.organisation.hashtags;

        // Get a random card (hashtag) from the database that
        // - is not in the game leftSwipedHashtags
        // - is not in the game rightSwipedHashtags
        // - is a parent card
        const newRandomHashtag = await Card.aggregate([
            {
                $match: {
                    isParent: true,
                    isDeleted: false,
                    _id: query
                }
            },
            { $sample: { size: 1 } }
        ]);

        if (newRandomHashtag.length === 0) throw new CustomError("all hashtags have been used");

        // Return the hashtag
        return newRandomHashtag[0];
    }

    async addLeftSwipedCard(gameId, data) {
        if (!data.cardId) throw new CustomError("card id is required");
        const game = await Game.findOneAndUpdate({ _id: gameId }, { $push: { leftSwipedCards: { $each: [data.cardId], $position: 0 } } }, { new: true });
        if (!game) throw new CustomError("game does not exist", 404);
        return game;
    }

    async addRightSwipedCard(gameId, data) {
        if (!data.cardId) throw new CustomError("card id is required");
        const game = await Game.findOneAndUpdate({ _id: gameId }, { $push: { rightSwipedCards: data.cardId } }, { new: true });
        if (!game) throw new CustomError("game does not exist", 404);
        return game;
    }

    async updateRightSwipedCards(gameId, data) {
        if (!data.cardIds) throw new CustomError("card id's are required");
        const game = await this.update(gameId, { rightSwipedCards: data.cardIds });
        return game;
    }

    async addLeftSwipedHashtag(gameId, data) {
        if (!data.hashtagId) throw new CustomError("hashtag id is required");
        const game = await Game.findOneAndUpdate({ _id: gameId }, { $push: { leftSwipedHashtags: data.hashtagId } }, { new: true });
        if (!game) throw new CustomError("game does not exist", 404);
        return game;
    }

    async addRightSwipedHashtag(gameId, data) {
        if (!data.hashtagId) throw new CustomError("hashtag id is required");
        const game = await Game.findOneAndUpdate({ _id: gameId }, { $push: { rightSwipedHashtags: data.hashtagId } }, { new: true });
        if (!game) throw new CustomError("game does not exist", 404);
        return game;
    }

    async update(gameId, data) {
        const game = await Game.findByIdAndUpdate({ _id: gameId }, { $set: data }, { new: true });
        if (!game) throw new CustomError("game does not exist", 404);
        return game;
    }

    async delete(gameId) {
        const game = await this.update(gameId, { isDeleted: true });
        return game;
    }
}

module.exports = new GameService();
