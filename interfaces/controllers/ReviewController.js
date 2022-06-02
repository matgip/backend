const { StatusCodes } = require("http-status-codes");

const ReviewRepository = require("../../infrastructure/repositories/reviews/review");
const ReviewUserLikeRepository = require("../../infrastructure/repositories/reviews/likeOrder");
const ReviewTimeOrderRepository = require("../../infrastructure/repositories/reviews/timeOrder");

const getReview = async (req, res) => {
  try {
    const review = await ReviewRepository.getReview(req.params.agencyId, req.params.userId);
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

const isUserLikeWriterReview = async (req, res) => {
  try {
    const result = await ReviewUserLikeRepository.isUserLikeWriterReview(
      req.params.agencyId,
      req.params.writerId,
      req.query.userId
    );
    res.json(result);
  } catch (err) {
    console.error(err);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const getUsersByLikeOrder = async (req, res) => {
  try {
    const users = await ReviewUserLikeRepository.getUsers(req.params.agencyId, req.query);
    res.json(users);
  } catch (err) {
    console.error(err);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const getUsersByTimeOrder = async (req, res) => {
  try {
    const users = await ReviewTimeOrderRepository.getUsers(req.params.agencyId, req.query);
    res.json(users);
  } catch (err) {
    console.error(err);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const createReview = async (req, res) => {
  try {
    await ReviewRepository.persistReview(req.params.agencyId, req.body);
    res.sendStatus(StatusCodes.OK);
  } catch (err) {
    console.error(err);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const updateLikeCountOfWriter = async (req, res) => {
  try {
    await ReviewUserLikeRepository.mergeUserLike(req.params.agencyId, req.params.writerId, req.body);
    res.sendStatus(StatusCodes.OK);
  } catch (err) {
    console.error(err);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

module.exports = {
  // GET
  getReview,
  isUserLikeWriterReview,
  getUsersByLikeOrder,
  getUsersByTimeOrder,
  // POST
  createReview,
  // PUT
  updateLikeCountOfWriter,
};
