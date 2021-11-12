const Card = require("./../models/card.model");
const CustomError = require("./../utils/custom-error");
const ObjectId = require("mongoose").Types.ObjectId;

class CardService {
  // Create Card
  async create(data, user) {
    if (!data.cardTitle) throw new CustomError("Card Title is required");
    if (!data.cardImage) throw new CustomError("Card Image is required");
    if (!data.cardCategory) throw new CustomError("Card Category is required");

    return await new Card({ userId: user._id, ...data }).save();
  }

  async getAll() {
    return await Card.find({ isDeleted: false }, { __v: 0 }).populate(
      "userId",
      "_id codeName"
    );
  }

  async getAllCategories() {
    return await Card.distinct("cardCategory");
  }

  async getOne(cardId) {
    if (!ObjectId.isValid(cardId)) throw new CustomError("Card does not exist");

    const card = await Card.findOne({ _id: cardId }).populate(
      "userId",
      "_id codeName"
    );
    if (!card) throw new CustomError("Card does not exist");

    return card;
  }

  async getAllByUser(user) {
    return await Card.find({ userId: user._id, isDeleted: false }, { __v: 0 });
  }

  async delete(cardId) {
    if (!ObjectId.isValid(cardId)) throw new CustomError("Card does not exist");

    const card = await Card.findOneAndUpdate(
      { _id: cardId },
      { isDeleted: true },
      { new: true }
    );

    if (!card) throw new CustomError("Card does not exist");

    return card;
  }
}

module.exports = new CardService();
