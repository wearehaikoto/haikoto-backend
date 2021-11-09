const Card = require("./../models/card.model");
const CustomError = require("./../utils/custom-error");

class CardService {
    // Create Card
    async create(data, user) {
        if (!data.cardTitle) throw new CustomError("Card Title is required");
        if (!data.cardImage) throw new CustomError("Card Image is required");
        if (!data.cardCategory)
            throw new CustomError("Card Category is required");

        return await new Card({ userId: user._id, ...data }).save();
    }

    async getAll() {
        return await Card.find({}, { __v: 0 }).populate("userId", "_id codeName");
    }

    async getAllByUser(user) {
        return await Card.find({ userId: user._id }, { __v: 0 });
    }
}

module.exports = new CardService();
