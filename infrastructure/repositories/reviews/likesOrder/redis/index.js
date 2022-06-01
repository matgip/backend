// Reference: https://www.npmjs.com/package/redis
const client = require("../../../../config/redis/client");
const ReviewLikeOrderRepository = require("../../../../../domain/ReviewLikeOrderRepository");

module.exports = class extends ReviewLikeOrderRepository {
  constructor() {
    super();
  }

  async update(agencyId, likeEntity) {
    const { userId, increment } = likeEntity;
    await client.ZINCRBY(`reviews:${agencyId}:likes`, increment, `user:${userId}`);
  }

  async get(agencyId, query) {
    const range = query.range.split("~");
    const reviewedUsers = await client.ZRANGE_WITHSCORES(
      `reviews:${agencyId}:likes`,
      range[0],
      range[range.length - 1],
      { REV: true }
    );
    return reviewedUsers;
  }
};
