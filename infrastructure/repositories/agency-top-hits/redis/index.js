// Reference: https://www.npmjs.com/package/redis
const client = require("../../../config/redis/client");
const AgencyTopHitsRepository = require("../../../../domain/AgencyTopHitsRepository");
const AgencyRepository = require("../../agency");

module.exports = class extends AgencyTopHitsRepository {
  constructor() {
    super();
  }

  async get(query) {
    const range = query.range.split("~");
    const topHitsAgencies = await client.ZRANGE_WITHSCORES(
      "realtime_agencies_views",
      range[0],
      range[range.length - 1],
      { REV: true }
    );
    const result = [];
    await Promise.all(
      topHitsAgencies.map(async (scoreValue) => {
        const agency = await AgencyRepository.get(scoreValue.value.split(":")[1]);
        result.push({ name: agency.place_name, address_name: agency.address_name, views: scoreValue.score });
      })
    );
    return result;
  }
};
