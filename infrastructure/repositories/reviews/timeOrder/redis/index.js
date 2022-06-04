const client = require("../../../../config/redis/client");
const ReviewTimeOrderRepository = require("../../../../../domain/ReviewTimeOrderRepository");

module.exports = class extends ReviewTimeOrderRepository {
  constructor() {
    super();
  }

  async getUsers(agencyId, query) {
    const range = query.range.split("~");
    return await client.ZRANGE_WITHSCORES(`review:${agencyId}:times`, range[0], range[range.length - 1], {
      REV: true,
    });
  }
};
