const { StatusCodes } = require("http-status-codes");

const ReviewRepository = require("../../infrastructure/repositories/reviews/review");

const getReview = async (req, res) => {
  try {
    const review = await ReviewRepository.get(req.params.agencyId, req.params.userId);
    if (ReviewRepository.isEmpty(review) === true) {
      res.sendStatus(StatusCodes.NO_CONTENT);
      return;
    }
    res.json(review);
  } catch (err) {
    console.error(err);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const createReview = async (req, res) => {
  try {
    await ReviewRepository.persist(req.params.agencyId, req.body);
    res.sendStatus(StatusCodes.OK);
  } catch (err) {
    console.error(err);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

module.exports = {
  getReview,
  createReview,
};
