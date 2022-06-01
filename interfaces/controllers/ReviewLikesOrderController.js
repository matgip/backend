const { StatusCodes } = require("http-status-codes");

const ReviewLikeOrderRepository = require("../../infrastructure/repositories/reviews/likesOrder");

const get = async (req, res) => {
  try {
    const reviewedUsers = await ReviewLikeOrderRepository.get(req.params.agencyId, req.query);
    res.json(reviewedUsers);
  } catch (err) {
    console.error(err);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const update = async (req, res) => {
  try {
    await ReviewLikeOrderRepository.update(req.params.agencyId, req.body);
    res.sendStatus(StatusCodes.OK);
  } catch (err) {
    console.error(err);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

module.exports = {
  get,
  update,
};
