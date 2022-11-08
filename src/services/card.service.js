const ImgBB = require("../lib/imgbb");
const Card = require("./../models/card.model");
const HashtagService = require("./hashtag.service");
const CustomError = require("./../utils/custom-error");

class CardService {
    async create(data) {
        if (!data.title) throw new CustomError("card title is required");

        if (!data.base64) {
            if (!data.description) throw new CustomError("card description is required when no image is uploaded");
        }

        if (!data.hashtagRefs) data.hashtagRefs = [];
        if (data.hashtagRefs.length === 0) throw new CustomError("card must have at least one hashtag");

        // Check that hashtagRefs are valid hashtagId's
        for (let i = 0; i < data.hashtagRefs.length; i++) {
            await HashtagService.getOne(data.hashtagRefs[i]);
        }

        if (data.base64) {
            const uploadImage = await ImgBB.uploadImage(data.base64);
            data.imageUrl = uploadImage.Location;
        }

        const context = {
            title: data.title,
            description: data.description,
            imageUrl: data.imageUrl,
            bgColor: data.bgColor,
            hashtagRefs: data.hashtagRefs
        };

        return await new Card(context).save();
    }

    async getAll() {
        return await Card.find({})
            // check if not deleted
            .where({ isDeleted: { $in: [false, undefined] } })
            // Populate hashtagRefs
            .populate({ path: "hashtagRefs", select: "title" });
    }

    async getOne(cardId) {
        const card = await Card.findOne({ _id: cardId })
            // check if not deleted
            .where({ isDeleted: { $in: [false, undefined] } });

        if (!card) throw new CustomError("Card does not exists");

        return card;
    }

    async update(cardId, data) {
        const card = await Card.findByIdAndUpdate({ _id: cardId }, { $set: data }, { new: true })
            // check if not deleted
            .where({ isDeleted: { $in: [false, undefined] } });

        if (!card) throw new CustomError("Card dosen't exist", 404);

        return card;
    }

    async delete(cardId) {
        return await this.update(cardId, { isDeleted: true });
    }
}

module.exports = new CardService();
