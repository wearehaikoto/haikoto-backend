const Game = require("./../models/game.model");
const Card = require("./../models/card.model");
const CustomError = require("./../utils/custom-error");
const response = require("./../utils/response");

class GameService {
    // Create Game
    async create(data, user) {
        // Validation check
        if (!data.numberOfCards)
            throw new CustomError("Number of Cards is required");

        // Check if cards are available in the database
        const cards = await Card.find({}).limit(data.numberOfCards).size();
        if (cards.length < data.numberOfCards)
            throw new CustomError(
                "Sorry we don't have any cards in the database"
            );

        // Get random cards
        const randomCards = await Card.aggregate([
            { $sample: { size: data.numberOfCards } },
            { $project: { _id: 1 } }
        ]);

        // Create Game with random cards
        const game = await new Game({ userId: user._id, cards: randomCards }).save();

        // Return Cards populated
        return await game.populate("cards");
    }

    // Get All Games in the Database
    async getAll() {
        return await Game.find({}, { __v: 0 }).populate(
            "userId cards",
            "-userId -__v"
        );
    }

    // Get All Games in the Database By User
    async getAllByUser(user) {
        return await Game.find({ userId: user._id }, { __v: 0 }).populate(
            "cards",
            "-userId -__v"
        );
    }
}

module.exports = new GameService();
