const Card = require("./../models/card.model");
const CustomError = require("./../utils/custom-error");

class CardService {
    // Create Card
    async create(data) {
        if (!data.cardTitle) throw new CustomError("Card Title is required");
        if (!data.cardImage) throw new CustomError("Card Image is required");
        if (!data.cardCategory)
            throw new CustomError("Card Category is required");

        return await new Card(data).save();
    }
}

module.exports = new CardService();
