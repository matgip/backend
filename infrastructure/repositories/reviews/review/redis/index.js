// Reference: https://www.npmjs.com/package/redis
const client = require("../../../../config/redis/client");
const ReviewRepository = require("../../../../../domain/ReviewRepository");

module.exports = class extends ReviewRepository {
  constructor() {
    super();
  }

  async persistReview(agencyId, reviewEntity) {
    const { userId, avatar, nickname, time, rating, kindness, price, contract, title, text } = reviewEntity;
    await client
      .multi()
      // 리뷰 내용
      .HSET(`reviews:${agencyId}:users:${userId}`, "title", title)
      .HSET(`reviews:${agencyId}:users:${userId}`, "text", text)
      // 작성자 정보
      .HSET(`reviews:${agencyId}:users:${userId}`, "avatar", avatar)
      .HSET(`reviews:${agencyId}:users:${userId}`, "nickname", nickname)
      .HSET(`reviews:${agencyId}:users:${userId}`, "time", time)
      // 세부 리뷰 항목
      .HSET(`reviews:${agencyId}:users:${userId}`, "rating", rating)
      .HSET(`reviews:${agencyId}:users:${userId}`, "price", price)
      .HSET(`reviews:${agencyId}:users:${userId}`, "kindness", kindness)
      .HSET(`reviews:${agencyId}:users:${userId}`, "contract", contract)
      // 리뷰 총점
      .INCRBYFLOAT(`reviews:${agencyId}:ratings`, rating)
      // 리뷰 좋아요/시간 순 정렬
      .ZADD(`reviews:${agencyId}:likes`, [{ score: 0, value: `user:${userId}` }])
      .ZADD(`reviews:${agencyId}:time`, [{ score: Math.floor(new Date().getTime() / 1000), value: `user:${userId}` }])
      .exec();
  }

  async getReview(agencyId, userId) {
    return await client.HGETALL(`reviews:${agencyId}:users:${userId}`);
  }

  isEmpty(result) {
    return Object.keys(result).length === 0;
  }
};
