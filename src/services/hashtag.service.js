const Hashtag = require("./../models/hashtag.model");
const CustomError = require("./../utils/custom-error");

class HashtagService {
    async create(data) {
        if (!data.title) throw new CustomError("hashtag title is required");

        if (!data.imageUrl) {
            if (!data.description) throw new CustomError("hashtag description is required if no image");
        }

        // if (!data.imageUrl) throw new CustomError("hashtag image is required");
        if (data.parentHashtag) {
            // Check if hashtag exitst
            await this.getOne(data.parentHashtag);
        } else {
            // Set the parent hashtag to null
            data.parentHashtag = null;
        }

        return await new Hashtag(data).save();
    }

    async getAll() {
        return await Hashtag.find({ isDeleted: false });
    }

    async getAllWithParentHashtag() {
        return await Hashtag.find({ isDeleted: false }).populate("parentHashtag", { title: 1 });
    }

    async getAllTitles() {
        return await Hashtag.find({ isDeleted: false }, { title: 1 });
    }

    async getOne(hashtagId) {
        const hashtag = await Hashtag.findOne({ _id: hashtagId });
        if (!hashtag) throw new CustomError("hashtag does not exist", 404);
        return hashtag;
    }

    async update(hashtagId, data) {
        if (typeof data.parentHashtag !== "undefined" && data.parentHashtag === "") data.parentHashtag = null;

        const hashtag = await Hashtag.findByIdAndUpdate({ _id: hashtagId }, { $set: data }, { new: true });
        if (!hashtag) throw new CustomError("hashtag does not exist", 404);
        return hashtag;
    }

    async delete(hashtagId) {
        const hashtag = await this.update(hashtagId, { isDeleted: true });
        return hashtag;
    }
}

module.exports = new HashtagService();
