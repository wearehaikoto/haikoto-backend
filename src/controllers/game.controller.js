const response = require("./../utils/response");
const GameServ = require("./../services/game.service");

class GameContoller {
    async create(req, res) {
        const result = await GameServ.create(req.$user._id);
        res.status(201).send(response("game created", result));
    }

    async getAll(req, res) {
        const result = await GameServ.getAll();
        res.status(200).send(response("all game", result));
    }

    async getOneByMe(req, res) {
        const result = await GameServ.getOneByUser(req.$user._id);
        res.status(200).send(response("game by user", result));
    }

    async getOneByUser(req, res) {
        const result = await GameServ.getOneByUser(req.params.userId);
        res.status(200).send(response("game by user", result));
    }

    async checkIfNewCardForGame(req, res) {
        const result = await GameServ.checkIfNewCardForGame(req.$user._id);
        res.status(200).send(response("game query", result));
    }

    async getOne(req, res) {
        const result = await GameServ.getOne(req.params.gameId);
        res.status(200).send(response("game data", result));
    }

    async newCard(req, res) {
        const result = await GameServ.newCard(req.params.gameId);
        res.status(200).send(response("new card", result));
    }

    async newHashtag(req, res) {
        const result = await GameServ.newHashtag(req.params.gameId, req.$user._id);
        res.status(200).send(response("new hashtag", result));
    }

    async addLeftSwipedCard(req, res) {
        const result = await GameServ.addLeftSwipedCard(req.params.gameId, req.body);
        res.status(200).send(response("new left swiped card added", result));
    }

    async addRightSwipedCard(req, res) {
        const result = await GameServ.addRightSwipedCard(req.params.gameId, req.body);
        res.status(200).send(response("new right swiped card added", result));
    }

    async updateRightSwipedCards(req, res) {
        const result = await GameServ.updateRightSwipedCards(req.params.gameId, req.body);
        res.status(200).send(response("right swiped cards updated", result));
    }

    async addLeftSwipedHashtag(req, res) {
        const result = await GameServ.addLeftSwipedHashtag(req.params.gameId, req.body);
        res.status(200).send(response("new left swiped hashtag added", result));
    }

    async addRightSwipedHashtag(req, res) {
        const result = await GameServ.addRightSwipedHashtag(req.params.gameId, req.body);
        res.status(200).send(response("new right swiped hashtag added", result));
    }

    async update(req, res) {
        const result = await GameServ.update(req.params.gameId, req.body);
        res.status(200).send(response("game updated", result));
    }

    async delete(req, res) {
        const result = await GameServ.delete(req.params.gameId);
        res.status(200).send(response("game deleted", result));
    }
}

module.exports = new GameContoller();
