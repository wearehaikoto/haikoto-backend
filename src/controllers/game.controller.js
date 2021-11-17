const response = require("../utils/response");
const GameService = require("../services/game.service.js");

class GameContoller {
    async create(req, res) {
        const result = await GameService.create(req.body, req.$user);
        res.status(200).send(response("game created successfully", result));
    }

    async getAll(req, res) {
        const result = await GameService.getAll();
        res.status(200).send(response("all games", result));
    }

    async getOne(req, res) {
        const result = await GameService.getOne(req.params.gameId);
        res.status(200).send(response("game data", result));
    }

    async addNoCard(req, res) {
        const result = await GameService.addNoCard(req.params.gameId, req.body);
        res.status(200).send(response("no card added", result));
    }

    async addYesCard(req, res) {
        const result = await GameService.addYesCard(req.params.gameId, req.body);
        res.status(200).send(response("yes card added", result));
    }

    async updateYesCards(req, res) {
        const result = await GameService.updateYesCards(req.params.gameId, req.body);
        res.status(200).send(response("yes cards updated", result));
    }

    async getAllByUser(req, res) {
        const result = await GameService.getAllByUser(req.$user);
        res.status(200).send(
            response(`All Games Played By ${req.$user.codeName}`, result)
        );
    }
}

module.exports = new GameContoller();
