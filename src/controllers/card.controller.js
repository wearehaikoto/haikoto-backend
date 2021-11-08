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

    async getAllByUser(req, res) {
        const result = await CardService.getAllByUser(req.$user);
        res.status(200).send(
            response(`All Cards By ${req.$user.codeName}`, result)
        );
    }
}

module.exports = new CardContoller();
