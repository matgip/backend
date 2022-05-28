// Reference: https://www.npmjs.com/package/redis
const client = require("../../../config/redis/client");
const AgencyTopHitsRepository = require("../../../../domain/AgencyTopHitsRepository");
const AgencyRepository = require("../../agency");

let baseTime = new Date().toLocaleDateString();

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
        result.push({
          baseTime: baseTime,
          name: agency.place_name,
          address_name: agency.address_name,
          views: scoreValue.score,
        });
      })
    );
    console.log(result);
    return result;
  }
};

function flush() {
  baseTime = new Date().toLocaleDateString();
  client.DEL("realtime_agencies_views");
}
setInterval(flush, 24 * 3600 * 1000);
