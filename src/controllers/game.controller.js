const response = require("../utils/response");
const GameService = require("../services/game.service.js");

class GameContoller {
    async create(req, res) {
        const result = await GameService.create(req.body, req.$user);
        res.status(200).send(response("game created successfully", result));
    }

    async checkIfNewCardForGame(req, res) {
        const result = await GameService.checkIfNewCardForGame(req.$user);
        res.status(200).send(response("check if cards are available", result));
    }

    async newCard(req, res) {
        const result = await GameService.newCard(req.params.gameId);
        res.status(200).send(response("new card added successfully", result));
    }

    async newHashtag(req, res) {
        const result = await GameService.newHashtag(req.$user, req.params.gameId);
        res.status(200).send(response("new hashtag added successfully", result));
    }

    async getAll(req, res) {
        const result = await GameService.getAll();
        res.status(200).send(response("all games", result));
    }

    async getOne(req, res) {
        const result = await GameService.getOne(req.params.gameId);
        res.status(200).send(response("game data", result));
    }

    async addLeftSwipedCard(req, res) {
        const result = await GameService.addLeftSwipedCard(req.params.gameId, req.body);
        res.status(200).send(response("leftSwiped card added", result));
    }

    async addRightSwipedCard(req, res) {
        const result = await GameService.addRightSwipedCard(req.params.gameId, req.body);
        res.status(200).send(response("rightSwiped card added", result));
    }

    async addLeftSwipedHashtag(req, res) {
        const result = await GameService.addLeftSwipedHashtag(req.params.gameId, req.body);
        res.status(200).send(response("leftSwiped hashtag added", result));
    }

    async addRightSwipedHashtag(req, res) {
        const result = await GameService.addRightSwipedHashtag(req.params.gameId, req.body);
        res.status(200).send(response("rightSwiped hashtag added", result));
    }

    async updateRightSwipedCards(req, res) {
        const result = await GameService.updateRightSwipedCards(req.params.gameId, req.body);
        res.status(200).send(response("rightSwiped cards updated", result));
    }

    async getAllByUser(req, res) {
        const result = await GameService.getAllByUser(req.$user);
        res.status(200).send(
            response(`All Games Played By ${req.$user.codeName}`, result)
        );
    }
}

module.exports = new GameContoller();
