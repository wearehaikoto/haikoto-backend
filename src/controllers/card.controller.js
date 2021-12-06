const response = require("../utils/response");
const CardService = require("../services/card.service.js");

class CardContoller {
  async create(req, res) {
    const result = await CardService.create(req.body, req.$user);
    res.status(200).send(response("Card created successfully", result));
  }

  async getAll(req, res) {
    const result = await CardService.getAll();
    res.status(200).send(response("All Cards", result));
  }

  async getAllCardsAsHashtag(req, res) {
    const result = await CardService.getAllCardsAsHashtag();
    res.status(200).send(response("All Cards as hashtags", result));
  }

  async getOne(req, res) {
    const result = await CardService.getOne(req.params.cardId);
    res.status(200).send(response("Card data", result));
  }

  async getAllByUser(req, res) {
    const result = await CardService.getAllByUser(req.$user);
    res.status(200).send(response(`All Cards By ${req.$user.codeName}`, result));
  }

  async eloRatingUpdate(req, res) {
    const result = await CardService.eloRatingUpdate(req.body);
    res.status(200).send(response("elo rating updated", result));
  }

  async delete(req, res) {
    const result = await CardService.delete(req.params.cardId);
    res.status(200).send(response("card deleted", result));
  }
}

module.exports = new CardContoller();
