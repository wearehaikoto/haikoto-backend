const response = require("../utils/response");
const GameService = require("../services/game.service.js");

class GameContoller {
    async create(req, res) {
        const result = await GameService.create(req.body, req.$user);
        res.status(200).send(response("Game created successfully", result));
    }

    async getAll(req, res) {
        const result = await GameService.getAll();
        res.status(200).send(response("All Games", result));
    }

    async getAllByUser(req, res) {
        const result = await GameService.getAllByUser(req.$user);
        res.status(200).send(
            response(`All Games Played By ${req.$user.codeName}`, result)
        );
    }
}

module.exports = new GameContoller();
