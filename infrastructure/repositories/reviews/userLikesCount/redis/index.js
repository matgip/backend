const client = require("../../../../config/redis/client");
const ReviewUserLikeRepository = require("../../../../../domain/ReviewUserLikeRepository");

module.exports = class extends ReviewUserLikeRepository {
  constructor() {
    super();
  }

  async isUserLikeWriterReview(agencyId, writerId, userId) {
    return await client.SISMEMBER(`reviews:${agencyId}:users:${writerId}:likes`, `users:${userId}`);
  }

  async getUsers(agencyId, query) {
    const range = query.range.split("~");
    const reviewedUsers = await client.ZRANGE_WITHSCORES(
      `reviews:${agencyId}:likes`,
      range[0],
      range[range.length - 1],
      { REV: true }
    );
    return reviewedUsers;
  }

  async mergeUserLike(agencyId, writerId, userEntity) {
    const { userId, operation, increment } = userEntity;
    const isExist = await this.isUserLikeWriterReview(agencyId, writerId, userId);
    if (!this.isValidRequest(isExist, operation)) return;

    if (!isExist && operation === "increase") {
      await client.SADD(`reviews:${agencyId}:users:${writerId}:likes`, `users:${userId}`);
    }
    if (isExist && operation === "decrease") {
      await client.SREM(`reviews:${agencyId}:users:${writerId}:likes`, `users:${userId}`);
    }
    await client.ZINCRBY(`reviews:${agencyId}:likes`, increment, `user:${userId}`);
  }

  isValidRequest(isExist, operation) {
    if (isExist && operation === "increase") return false;
    if (!isExist && operation === "decrease") return false;
    return true;
  }
};
