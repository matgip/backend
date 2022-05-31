// Reference: https://www.npmjs.com/package/redis
const client = require("../../../config/redis/client");
const sortedSet = require("../../../config/redis/sortedSet");
const AgencyRepository = require("../../../../domain/AgencyRepository");

let baseTime = new Date().toLocaleDateString();

module.exports = class extends AgencyRepository {
  constructor() {
    super();
  }

  async persist(entity) {
    const { id, y, x, place_name, phone, address_name, road_address_name } = entity;
    console.log("agencies persist : " + id + " (" + y + ", " + x + ") " + place_name + " : " + address_name);
    await client
      .multi()
      .HSET(`agencies:${id}`, "id", id)
      .HSET(`agencies:${id}`, "y", y)
      .HSET(`agencies:${id}`, "x", x)
      .HSET(`agencies:${id}`, "phone", phone)
      .HSET(`agencies:${id}`, "place_name", place_name)
      .HSET(`agencies:${id}`, "address_name", address_name)
      .HSET(`agencies:${id}`, "road_address_name", road_address_name)
      .geoAdd(`agencies`, {
        longitude: x,
        latitude: y,
        member: id,
      })
      .exec();
  }

  async persistAgencyByKeyword(keyword, agencyId) {
    await client.SADD(`agencies_keyword:${keyword}`, agencyId);
  }

  async searchByKeyword(keyword) {
    const ids = await client.SMEMBERS(`agencies_keyword:${keyword}`);
    const agencies = [];
    await Promise.all(
      ids.map(async (id) => {
        agencies.push(await this.get(id));
      })
    );
    return agencies;
  }

  async searchByRadius(lat, lng, radius) {
    const ids = await client.GEOSEARCH("agencies", { latitude: lat, longitude: lng }, { radius: radius, unit: "m" });
    const agencies = [];
    await Promise.all(
      ids.map(async (id) => {
        agencies.push(await this.get(id));
      })
    );
    return agencies;
  }

  async get(agencyId) {
    const agency = await client.HGETALL(`agencies:${agencyId}`);
    // REFACTORING: Combining (likes/stars) into agency
    agency.likes = 0;
    agency.stars = 0.0;
    if (!this.isEmpty(agency)) {
      const likes = await client.SCARD(`agencies:${agencyId}:likes`);
      const sumOfRatings = await client.GET(`reviews:${agencyId}:ratings`);
      const reviewCnt = await client.ZCARD(`reviews:${agencyId}:likes`);

      agency.likes = likes;
      agency.reviewCnt = reviewCnt;
      if (reviewCnt != 0) {
        agency.stars = sumOfRatings / reviewCnt;
      }
    }
    // 부동산 조회수
    agency.views = await this.getViews(agencyId);
    return agency;
  }

  async getViews(agencyId) {
    const agencyViews = await client.HGETALL(`agencies:${agencyId}:views`);
    return agencyViews === undefined ? 0 : agencyViews;
  }

  async getLikes(agencyId, userId) {
    return await client.SISMEMBER(`agencies:${agencyId}:likes`, `users:${userId}`);
  }

  async getTopHits(query) {
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
        const agency = await this.get(scoreValue.value.split(":")[1]);
        result.push({
          baseTime: baseTime,
          name: agency.place_name,
          address_name: agency.address_name,
          views: scoreValue.score,
        });
      })
    );
    return result;
  }

  async mergeViews(reqEntity) {
    const { agencyId, user } = reqEntity;
    if (!(await this.isPassed24Hours(agencyId, user.id))) return;
    await client.HSET(`agencies:${agencyId}:last_view_time`, `users:${user.id}`, new Date().getTime() / 1000);
    await client.HINCRBY(`agencies:${agencyId}:views`, `range:${user.userAge.split("~")[0]}`, 1);
    // 실시간 인기 검색어 +1
    await client.ZINCRBY(`realtime_agencies_views`, 1, `agencies:${agencyId}`);
  }

  async mergeLikes(agencyId, likeEntity) {
    const { userId, operation } = likeEntity;
    const isExist = await this.getLikes(agencyId, userId);
    if (!isExist && operation === "increase") {
      const result = await client.SADD(`agencies:${agencyId}:likes`, `users:${userId}`);
      return { result: sortedSet.toString(result) };
    }
    if (isExist && operation === "decrease") {
      const result = await client.SREM(`agencies:${agencyId}:likes`, `users:${userId}`);
      return { result: sortedSet.toString(result) };
    }
    // Invalid Operation
    return { result: "failed" };
  }

  async isPassed24Hours(agencyId, userId) {
    const lastViewTime = await client.HGET(`agencies:${agencyId}:last_view_time`, `users:${userId}`);
    const currentTime = new Date().getTime() / 1000;
    return currentTime - lastViewTime > 24 * 3600;
  }

  isEmpty(agency) {
    return !agency.id || !agency.y || !agency.x || !agency.place_name || !agency.address_name;
  }
};

function flush() {
  baseTime = new Date().toLocaleDateString();
  client.DEL("realtime_agencies_views");
}
setInterval(flush, 24 * 3600 * 1000);
