const client = require("../../../../config/redis/client");
const ReviewUserLikeRepository = require("../../../../../domain/ReviewUserLikeRepository");
const sortedSet = require("../../../../config/redis/sortedSet");

module.exports = class extends ReviewUserLikeRepository {
  constructor() {
    super();
  }

  async get(agencyId, writerId, userId) {
    return await client.SISMEMBER(`reviews:${agencyId}:users:${writerId}:likes`, `users:${userId}`);
  }

  async merge(agencyId, writerId, userEntity) {
    const { userId, operation } = userEntity;
    const isExist = await this.get(agencyId, writerId, userId);
    if (!isExist && operation === "increase") {
      const result = await client.SADD(`reviews:${agencyId}:users:${writerId}:likes`, `users:${userId}`);
      console.log("SADD RESULT: ", result);
      return { result: sortedSet.toString(result) };
    }
    if (isExist && operation === "decrease") {
      const result = await client.SREM(`reviews:${agencyId}:users:${writerId}:likes`, `users:${userId}`);
      return { result: sortedSet.toString(result) };
    }
    // Invalid Operation
    return { result: "failed" };
  }
};
