const client = require("../../../../config/redis/client");
const ReviewUserLikeRepository = require("../../../../../domain/ReviewUserLikeRepository");

module.exports = class extends ReviewUserLikeRepository {
  constructor() {
    super();
  }

  async isUserLikeWriterReview(agencyId, writerId, userId) {
    return await client.SISMEMBER(`review:${agencyId}:writer:${writerId}:likes`, `user:${userId}`);
  }

  async getUsers(agencyId, query) {
    const range = query.range.split("~");
    return await client.ZRANGE_WITHSCORES(`review:${agencyId}:likes`, range[0], range[range.length - 1], {
      REV: true,
    });
  }

  async mergeUserLike(agencyId, writerId, userEntity) {
    const { userId, operation, increment } = userEntity;
    const isExist = await this.isUserLikeWriterReview(agencyId, writerId, userId);
    if (!this.isValidRequest(isExist, operation)) return;

    if (!isExist && operation === "increase") {
      await client.SADD(`review:${agencyId}:writer:${writerId}:likes`, `user:${userId}`);
    }
    if (isExist && operation === "decrease") {
      await client.SREM(`review:${agencyId}:writer:${writerId}:likes`, `user:${userId}`);
    }
    await client.ZINCRBY(`review:${agencyId}:likes`, increment, `user:${userId}`);
  }

  isValidRequest(isExist, operation) {
    if (isExist && operation === "increase") return false;
    if (!isExist && operation === "decrease") return false;
    return true;
  }
};
