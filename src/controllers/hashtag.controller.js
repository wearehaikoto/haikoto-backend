const response = require("../utils/response");
const HashtagService = require("./../services/hashtag.service");

class HashtagContoller {

  async create(req, res) {
    const result = await HashtagService.create(req.body);
    res.status(201).send(response("hashtag created", result));
  }

  async getAll(req, res) {
    const result = await HashtagService.getAll();
    res.status(200).send(response("All hashtag", result));
  }

  async getOne(req, res) {
    const result = await HashtagService.getOne(req.params.hashtagId);
    res.status(200).send(response("hashtag data", result));
  }

  async update(req, res) {
    const result = await HashtagService.update(req.params.hashtagId, req.body);
    res.status(200).send(response("hashtag updated", result));
  }

  async delete(req, res) {
    const result = await HashtagService.delete(req.params.hashtagId);
    res.status(200).send(response("hashtag deleted", result));
  }

}

module.exports = new HashtagContoller();
