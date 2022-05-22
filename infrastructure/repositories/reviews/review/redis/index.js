// Reference: https://www.npmjs.com/package/redis
const client = require("../../../../config/redis/client");
const ReviewRepository = require("../../../../../domain/ReviewRepository");

module.exports = class extends ReviewRepository {
  constructor() {
    super();
  }

  async persist(estateId, reviewEntity) {
    const { userId, avatar, nickname, time, rating, kindness, price, contract, title, text } = reviewEntity;
    await client
      .multi()
      // 리뷰 내용
      .HSET(`reviews:${estateId}:users:${userId}`, "title", title)
      .HSET(`reviews:${estateId}:users:${userId}`, "text", text)
      // 작성자 정보
      .HSET(`reviews:${estateId}:users:${userId}`, "avatar", avatar)
      .HSET(`reviews:${estateId}:users:${userId}`, "nickname", nickname)
      .HSET(`reviews:${estateId}:users:${userId}`, "time", time)
      // 세부 리뷰 항목
      .HSET(`reviews:${estateId}:users:${userId}`, "rating", rating)
      .HSET(`reviews:${estateId}:users:${userId}`, "price", price)
      .HSET(`reviews:${estateId}:users:${userId}`, "kindness", kindness)
      .HSET(`reviews:${estateId}:users:${userId}`, "contract", contract)
      // 리뷰 총점
      .INCRBYFLOAT(`reviews:${estateId}:ratings`, rating)
      // 리뷰 좋아요/시간 순 정렬
      .ZADD(`reviews:${estateId}:likes`, [{ score: 0, value: `user:${userId}` }])
      .ZADD(`reviews:${estateId}:time`, [{ score: Math.floor(new Date().getTime() / 1000), value: `user:${userId}` }])
      .exec();
  }

  async get(estateId, userId) {
    const review = await client.HGETALL(`reviews:${estateId}:users:${userId}`);
    return review;
  }

  isEmpty(result) {
    return Object.keys(result).length === 0;
  }
};
