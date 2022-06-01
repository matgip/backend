const { StatusCodes } = require("http-status-codes");

const ReviewUserLikeRepository = require("../../infrastructure/repositories/reviews/likeOrder");

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
    const reviewedUsers = await ReviewUserLikeRepository.getUsers(req.params.agencyId, req.query);
    res.json(reviewedUsers);
  } catch (err) {
    console.error(err);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const putUserToWriterReview = async (req, res) => {
  try {
    await ReviewUserLikeRepository.mergeUserLike(req.params.agencyId, req.params.writerId, req.body);
    res.sendStatus(StatusCodes.OK);
  } catch (err) {
    console.error(err);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

module.exports = {
  isUserLikeWriterReview,
  getUsersByLikeOrder,
  putUserToWriterReview,
};
