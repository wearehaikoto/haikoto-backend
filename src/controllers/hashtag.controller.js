const response = require("./../utils/response");
const HashtagServ = require("./../services/hashtag.service");

class HashtagContoller {
    async create(req, res) {
        const result = await HashtagServ.create(req.body);
        res.status(201).send(response("hashtag created", result));
    }

    async getAll(req, res) {
        const result = await HashtagServ.getAll();
        res.status(200).send(response("all hashtag", result));
    }

    async getAllTitles(req, res) {
        const result = await HashtagServ.getAllTitles();
        res.status(200).send(response("all hashtag titles", result));
    }

    async getAllWithParentHashtag(req, res) {
        const result = await HashtagServ.getAllWithParentHashtag();
        res.status(200).send(response("all hashtag with parents", result));
    }

    async getOne(req, res) {
        const result = await HashtagServ.getOne(req.params.hashtagId);
        res.status(200).send(response("hashtag data", result));
    }

    async update(req, res) {
        const result = await HashtagServ.update(req.params.hashtagId, req.body);
        res.status(200).send(response("hashtag updated", result));
    }

    async delete(req, res) {
        const result = await HashtagServ.delete(req.params.hashtagId);
        res.status(200).send(response("hashtag deleted", result));
    }
}

module.exports = new HashtagContoller();
