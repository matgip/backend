const { StatusCodes } = require("http-status-codes");

const ReviewUserLikeRepository = require("../../infrastructure/repositories/reviews/userLikesCount");

const get = async (req, res) => {
  try {
    const result = await ReviewUserLikeRepository.get(req.params.agencyId, req.params.writerId, req.query.userId);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const put = async (req, res) => {
  try {
    const result = await ReviewUserLikeRepository.merge(req.params.agencyId, req.params.writerId, req.body);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

module.exports = {
  get,
  put,
};
