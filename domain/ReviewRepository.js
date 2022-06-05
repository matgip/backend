module.exports = class {
  persistReview(estateId, reviewEntity) {
    throw new Error("ERR_METHOD_NOT_IMPLEMENTED");
  }

  getReview(estateId, userId) {
    throw new Error("ERR_METHOD_NOT_IMPLEMENTED");
  }

  getUsersByWrittenTimeOrder(agencyId, query) {
    throw new Error("ERR_METHOD_NOT_IMPLEMENTED");
  }

  getUsersByLikeOrder(agencyId, query) {
    throw new Error("ERR_METHOD_NOT_IMPLEMENTED");
  }

  isUserLikeWriterReview(agencyId, writerId, userId) {
    throw new Error("ERR_METHOD_NOT_IMPLEMENTED");
  }

  mergeLikeToWriterReview(agencyId, writerId, userEntity) {
    throw new Error("ERR_METHOD_NOT_IMPLEMENTED");
  }
};
