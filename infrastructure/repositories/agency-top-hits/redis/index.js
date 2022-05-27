// Reference: https://www.npmjs.com/package/redis
// const client = require("../../../config/redis/client");
const AgencyTopHitsRepository = require("../../../../domain/AgencyTopHitsRepository");
// const client = require("../../../config/redis/client");

module.exports = class extends AgencyTopHitsRepository {
  constructor() {
    super();
  }

  async get(query) {
    const range = query.range.split("~");
    console.log(range);
    // const top15HitsAgencies = await client.ZRANGE_WITHSCORES();
  }
};
