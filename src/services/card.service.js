const Card = require("./../models/card.model");
const HashtagService = require("./hashtag.service");
const CustomError = require("./../utils/custom-error");

class CardService {
    async create(data, userId) {
        if (!data.title) throw new CustomError("card title is required");
        // if (!data.description) throw new CustomError("card description is required");
        if (!data.imageUrl) throw new CustomError("card image is required");
        if (!data.hashtags) data.hashtags = [];

        if (data.hashtags.length === 0) throw new CustomError("card must have at least one hashtag");

        // Check that hashtags are valid cardId's
        for (let i = 0; i < data.hashtags.length; i++) {
            await HashtagService.getOne(data.hashtags[i]);
        }

        data.user = userId;

        return await new Card(data).save();
    }

    async getAll() {
        return await Card.find({ isDeleted: false });
    }

    async getAllWithHashtags() {
        return await Card.find({ isDeleted: false }).populate("hashtags", "title");
    }

    async getAllByUser(userId) {
        return await Card.find({ isDeleted: false, user: userId });
    }

    async getOne(cardId) {
        const card = await Card.findOne({ _id: cardId });
        if (!card) throw new CustomError("card does not exists", 404);
        return card;
    }

    async update(cardId, data) {
        if (typeof data.hashtags !== "undefined" && !data.hashtags) data.hashtags = [];
        if (typeof data.hashtags !== "undefined" && data.hashtags.length === 0) throw new CustomError("card must have at least one hashtag");

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
