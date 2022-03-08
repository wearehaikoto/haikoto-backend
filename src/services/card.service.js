const Card = require("./../models/card.model");
const CustomError = require("./../utils/custom-error");

class CardService {
    async create(data, userId) {
        if (!data.title) throw new CustomError("card title is required");
        if (!data.imageUrl) throw new CustomError("card image is required");
        if (typeof data.isParent === undefined) throw new CustomError("card parent type is required");
        if (!data.hashtags) data.hashtags = [];

        // Check that hashtags are valid cardId's
        for (let i = 0; i < data.hashtags.length; i++) {
            await this.getOne(data.hashtags[i]);
        }

        data.user = userId;

        return await new Card(data).save();
    }

    async getAll() {
        return await Card.find({ isDeleted: false });
    }

    async getAllByUser(userId) {
        return await Card.find({ isDeleted: false, user: userId });
    }

    async getAllHashtags() {
        return await Card.find({ isDeleted: false, isParent: true }).select("title");
    }

    async getOne(cardId) {
        const card = await Card.findOne({ _id: cardId });
        if (!card) throw new CustomError("card does not exists", 404);
        return card;
    }

    async update(cardId, data) {
        const card = await Card.findByIdAndUpdate({ _id: cardId }, { $set: data }, { new: true });
        if (!card) throw new CustomError("card does not exists", 404);
        return card;
    }

    async delete(cardId) {
        const card = await this.update(cardId, { isDeleted: true });
        return card;
    }
}

module.exports = new CardService();
