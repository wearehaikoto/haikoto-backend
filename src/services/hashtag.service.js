const Hashtag = require("./../models/hashtag.model");
const CustomError = require("./../utils/custom-error");
const ObjectId = require("mongoose").Types.ObjectId;

class HashtagService {
  async create(data) {
    if (!data.name) throw new CustomError("Name is required");

    // Check if hashtag already exists
    const hashtag = await Hashtag.findOne({ name: data.name });

    if (hashtag) return hashtag;

    return await new Hashtag(data).save();
  }

  async getAll() {
    return await Hashtag.find({});
  }

  async getAllParentHashtags() {
    return await Hashtag.find({ parentHashtag: null });
  }

  async getAllChildrenHashtags() {
    return await Hashtag.find({ parentHashtag: { $ne: null } });
  }

  async getAllChildrenHashtagsByParent(hashtagId) {
    if (!ObjectId.isValid(hashtagId)) throw new CustomError("Invalid HashtagId");

    return await Hashtag.find({ parentHashtag: hashtagId });
  }

  async getOne(hashtagId) {
    const hashtag = await Hashtag.findOne({ _id: hashtagId });
    if (!hashtag) throw new CustomError("Hashtag does not exists");

    return hashtag;
  }

  async update(hashtagId, data) {
    const hashtag = await Hashtag.findByIdAndUpdate(
      { _id: hashtagId },
      { $set: data },
      { new: true }
    );

    if (!hashtag) throw new CustomError("Hashtag dosen't exist", 404);

    return hashtag;
  }

  async delete(hashtagId) {
    if (!ObjectId.isValid(hashtagId))
      throw new CustomError("Hashtag does not exist");

    const hashtag = await Hashtag.findOneAndUpdate(
      { _id: hashtagId },
      { isDeleted: true },
      { new: true }
    );

    if (!hashtag) throw new CustomError("Hashtag does not exist");

    return hashtag;
  }
}

module.exports = new HashtagService();
