const { StatusCodes } = require("http-status-codes");

const ReviewTimeOrderRepository = require("../../infrastructure/repositories/reviews/timeOrder");

const get = async (req, res) => {
  try {
    const reviewedUsers = await ReviewTimeOrderRepository.get(req.params.agencyId, req.query);
    res.json(reviewedUsers);
  } catch (err) {
    console.error(err);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

module.exports = {
  get,
};
