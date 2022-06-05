// Reference: https://www.npmjs.com/package/redis
const client = require("../../../config/redis/client");
const UserRepository = require("../../../../domain/UserRepository");

module.exports = class extends UserRepository {
  constructor() {
    super();
  }

  async persist(userEntity) {
    const { id, email, nickname, avatar, ageRange } = userEntity;
    await client
      .multi()
      .HSET(`user:${id}`, "id", id)
      .HSET(`user:${id}`, "email", email)
      .HSET(`user:${id}`, "nickname", nickname)
      .HSET(`user:${id}`, "avatar", avatar)
      .HSET(`user:${id}`, "ageRange", ageRange)
      .exec();
  }

  async getUserInfo(userId) {
    return await client.HGETALL(`user:${userId}`);
  }

  async getReviews(userId) {
    const idsWithTag = await client.SMEMBERS(`user:${userId}:reviews`);
    const reviews = [];
    await Promise.all(
      idsWithTag.map(async (idWithTag) => {
        reviews.push(await client.HGETALL(`${idWithTag}:user:${userId}`));
      })
    );
    return reviews;
  }

  isEmpty(result) {
    return Object.keys(result).length === 0;
  }
};
