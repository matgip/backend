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
      .HSET(`review:${agencyId}:user:${userId}`, "title", title)
      .HSET(`review:${agencyId}:user:${userId}`, "text", text)
      // 작성자 정보
      .HSET(`review:${agencyId}:user:${userId}`, "avatar", avatar)
      .HSET(`review:${agencyId}:user:${userId}`, "nickname", nickname)
      .HSET(`review:${agencyId}:user:${userId}`, "time", time)
      // 세부 리뷰 항목
      .HSET(`review:${agencyId}:user:${userId}`, "rating", rating)
      .HSET(`review:${agencyId}:user:${userId}`, "price", price)
      .HSET(`review:${agencyId}:user:${userId}`, "kindness", kindness)
      .HSET(`review:${agencyId}:user:${userId}`, "contract", contract)
      // 리뷰 총점
      .INCRBYFLOAT(`review:${agencyId}:ratings`, rating)
      // 리뷰 좋아요/시간 순 정렬
      .ZADD(`review:${agencyId}:likes`, [{ score: 0, value: `user:${userId}` }])
      .ZADD(`review:${agencyId}:times`, [{ score: Math.floor(new Date().getTime() / 1000), value: `user:${userId}` }])
      // 유저가 쓴 리뷰 목록에 추가
      // TODO: MicroService가 되면 분리되어야 함
      .SADD(`user:${userId}:reviews`, `reviews:${agencyId}`)
      .exec();
  }

  async getReview(agencyId, userId) {
    return await client.HGETALL(`review:${agencyId}:user:${userId}`);
  }

  isEmpty(result) {
    return Object.keys(result).length === 0;
  }
};
