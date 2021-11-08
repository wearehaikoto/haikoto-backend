const response = require("../utils/response");
const CardService = require("../services/card.service.js");

class CardContoller {
  async create(req, res) {
    const result = await CardService.create(req.body);
    res.status(200).send(response("Card created successfully", result));
  }
}

module.exports = new CardContoller();