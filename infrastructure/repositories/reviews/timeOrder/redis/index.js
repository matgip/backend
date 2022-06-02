const client = require("../../../../config/redis/client");
const ReviewTimeOrderRepository = require("../../../../../domain/ReviewTimeOrderRepository");

module.exports = class extends ReviewTimeOrderRepository {
  constructor() {
    super();
  }

  async getUsers(estateId, query) {
    const range = query.range.split("~");
    return await client.ZRANGE_WITHSCORES(`reviews:${estateId}:time`, range[0], range[range.length - 1], {
      REV: true,
    });
  }
};
