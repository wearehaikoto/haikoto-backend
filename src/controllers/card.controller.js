const CardServ = require("./../services/card.service");

const response = require("./../utils/response");

class CardContoller {
    async create(req, res) {
        const result = await CardServ.create(req.body);
        res.status(201).send(response("card created", result));
    }

    async getAll(req, res) {
        const result = await CardServ.getAll();
        res.status(200).send(response("All card", result));
    }

    async getOne(req, res) {
        const result = await CardServ.getOne(req.params.cardId);
        res.status(200).send(response("card data", result));
    }

    async update(req, res) {
        const result = await CardServ.update(req.params.cardId, req.body);
        res.status(200).send(response("card updated", result));
    }

    async delete(req, res) {
        const result = await CardServ.delete(req.params.cardId);
        res.status(200).send(response("card deleted", result));
    }
}

module.exports = new CardContoller();
