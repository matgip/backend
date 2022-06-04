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

  async get(userId) {
    return await client.HGETALL(`user:${userId}`);
  }

  isEmpty(result) {
    return Object.keys(result).length === 0;
  }
};
