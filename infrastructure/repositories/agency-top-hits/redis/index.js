// Reference: https://www.npmjs.com/package/redis
const client = require("../../../config/redis/client");
const AgencyTopHitsRepository = require("../../../../domain/AgencyTopHitsRepository");

module.exports = class extends AgencyTopHitsRepository {
  constructor() {
    super();
  }

  async get(query) {
    const range = query.range.split("~");
    const top15HitsAgencies = await client.ZRANGE_WITHSCORES(
      "realtime_agencies_views",
      range[0],
      range[range.length - 1],
      { REV: true }
    );
    console.log(top15HitsAgencies);
    return top15HitsAgencies;
  }
};
