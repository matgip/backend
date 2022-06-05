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
      .SADD(`user:${userId}:reviews`, `review:${agencyId}`)
      .exec();
  }

  async getReview(agencyId, userId) {
    return await client.HGETALL(`review:${agencyId}:user:${userId}`);
  }

  async getUsersByWrittenTimeOrder(agencyId, query) {
    const ret = [];
    const range = query.range.split("~");
    const listOfValueWithScore = await client.ZRANGE_WITHSCORES(
      `review:${agencyId}:times`,
      range[0],
      range[range.length - 1],
      {
        REV: true,
      }
    );

    for (let valueWithScore of listOfValueWithScore) {
      const idWithTag = valueWithScore.value;
      const review = await client.HGETALL(`review:${agencyId}:${idWithTag}`);
      const likes = await client.ZSCORE(`reviews:${agencyId}`, idWithTag);
      ret.push(this._marshal(review, idWithTag.split(":")[1], likes));
    }
    return ret;
  }

  async getUsersByLikeOrder(agencyId, query) {
    const ret = [];
    const range = query.range.split("~");
    const listOfValueWithScore = await client.ZRANGE_WITHSCORES(
      `review:${agencyId}:likes`,
      range[0],
      range[range.length - 1],
      {
        REV: true,
      }
    );

    for (let valueWithScore of listOfValueWithScore) {
      const idWithTag = valueWithScore.value;
      const review = await client.HGETALL(`review:${agencyId}:${idWithTag}`);
      ret.push(this._marshal(review, idWithTag.split(":")[1], valueWithScore.score));
    }
    return ret;
  }

  async isUserLikeWriterReview(agencyId, writerId, userId) {
    return await client.SISMEMBER(`review:${agencyId}:writer:${writerId}:likes`, `user:${userId}`);
  }

  async mergeLikeToWriterReview(agencyId, writerId, userEntity) {
    const { userId, operation, increment } = userEntity;
    const isExist = await this.isUserLikeWriterReview(agencyId, writerId, userId);
    if (!this._isValidOperation(isExist, operation)) return;

    if (!isExist && operation === "increase") {
      // '리뷰 - 좋아요'
      await client
        .multi()
        .SADD(`review:${agencyId}:writer:${writerId}:likes`, `user:${userId}`)
        .ZINCRBY(`review:${agencyId}:likes`, increment, `user:${userId}`)
        .exec();
    } else {
      // '리뷰 - 좋아요' 취소
      await client
        .multi()
        .SREM(`review:${agencyId}:writer:${writerId}:likes`, `user:${userId}`)
        .ZINCRBY(`review:${agencyId}:likes`, increment, `user:${userId}`)
        .exec();
    }
  }

  isEmpty(result) {
    return Object.keys(result).length === 0;
  }

  _isValidOperation(isExist, operation) {
    if (isExist && operation === "increase") return false;
    if (!isExist && operation === "decrease") return false;
    return true;
  }

  _marshal(dataFromRedis, userId, likes) {
    const ret = Object.assign(dataFromRedis);
    ret.likes = likes;
    ret.userId = userId;
    return ret;
  }
};
