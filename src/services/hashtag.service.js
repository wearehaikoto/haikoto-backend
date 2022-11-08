const ImgBB = require("../lib/imgbb");
const Hashtag = require("./../models/hashtag.model");
const CustomError = require("./../utils/custom-error");

class HashtagService {
    async create(data) {
        if (!data.title) throw new CustomError("hashtag title is required");

        if (!data.base64) {
            if (!data.description) throw new CustomError("hashtag description is required when no image is uploaded");
        }

        if (data.parentHashtagRef) {
            // Check if hashtag exitst
            await this.getOne(data.parentHashtagRef);
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
            parentHashtagRef: data.parentHashtagRef || null
        };

        return await new Hashtag(context).save();
    }

    async getAll() {
        return await Hashtag.find({})
            // check if not deleted
            .where({ isDeleted: { $in: [false, undefined] } })
            // Populate parentHashtagRef
            .populate({ path: "parentHashtagRef", select: "title" });
    }

    async getAllTitles() {
        return await Hashtag.find({}, { title: 1 })
            // check if not deleted
            .where({ isDeleted: { $in: [false, undefined] } });
    }

    async getOne(hashtagId) {
        const hashtag = await Hashtag.findOne({ _id: hashtagId })
            // check if not deleted
            .where({ isDeleted: { $in: [false, undefined] } });

        if (!hashtag) throw new CustomError("Hashtag does not exists");

        return hashtag;
    }

    async update(hashtagId, data) {
        const hashtag = await Hashtag.findByIdAndUpdate({ _id: hashtagId }, { $set: data }, { new: true })
            // check if not deleted
            .where({ isDeleted: { $in: [false, undefined] } });

        if (!hashtag) throw new CustomError("Hashtag dosen't exist", 404);

        return hashtag;
    }

    async delete(hashtagId) {
        return await this.update(hashtagId, { isDeleted: true });
    }
}

module.exports = new HashtagService();
