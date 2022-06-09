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
      .HSET(`agency:${id}`, "id", id)
      .HSET(`agency:${id}`, "y", y)
      .HSET(`agency:${id}`, "x", x)
      .HSET(`agency:${id}`, "phone", phone)
      .HSET(`agency:${id}`, "place_name", place_name)
      .HSET(`agency:${id}`, "address_name", address_name)
      .HSET(`agency:${id}`, "road_address_name", road_address_name)
      .geoAdd(`agency`, {
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
    const ids = await client.GEOSEARCH("agency", { latitude: lat, longitude: lng }, { radius: radius, unit: "m" });
    const agencies = [];
    await Promise.all(
      ids.map(async (id) => {
        agencies.push(await this.get(id));
      })
    );
    return agencies;
  }

  async get(agencyId) {
    const agency = await client.HGETALL(`agency:${agencyId}`);
    // REFACTORING: Combining (likes/stars) into agency
    agency.likes = 0;
    agency.stars = 0.0;
    if (!this.isEmpty(agency)) {
      const likes = await client.SCARD(`agency:${agencyId}:likes`);
      const sumOfRatings = await client.GET(`review:${agencyId}:ratings`);
      const reviewCnt = await client.ZCARD(`review:${agencyId}:likes`);

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
    const agencyViews = await client.HGETALL(`agency:${agencyId}:views`);
    return agencyViews === undefined ? 0 : agencyViews;
  }

  async getLikes(agencyId, userId) {
    return await client.SISMEMBER(`agency:${agencyId}:likes`, `user:${userId}`);
  }

  async getTopHitAgencies(query) {
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

  async getTopHitAreas(query) {
    const range = query.range.split("~");
    const topHitsAreas = await client.ZRANGE_WITHSCORES("realtime_area_views", range[0], range[range.length - 1], {
      REV: true,
    });

    const result = [];
    await Promise.all(
      topHitsAreas.map(async (scoreValue) => {
        const area = scoreValue.value.split(":")[1];
        result.push({
          area: area,
          views: scoreValue.score,
        });
      })
    );
    return result;
  }

  async mergeViews(reqEntity) {
    const { agencyId, user, addressName } = reqEntity;
    if (!(await this.isPassed24Hours(agencyId, user.id))) return;
    await client
      .multi()
      .HSET(`agency:${agencyId}:last_view_time`, `user:${user.id}`, new Date().getTime() / 1000)
      .HINCRBY(`agency:${agencyId}:views`, `range:${user.userAge.split("~")[0]}`, 1)
      // 실시간 인기 검색어 +1
      .ZINCRBY(`realtime_agencies_views`, 1, `agency:${agencyId}`)
      .ZINCRBY(`realtime_area_views`, 1, `area:${this.getArea(addressName)}`)
      .exec();
  }

  async mergeLikes(agencyId, likeEntity) {
    const { userId, operation } = likeEntity;
    if (!(await this._isValidOperation(operation, { agencyId, userId }))) return { result: "failed" };
    if (operation === "increase") {
      const result = await client.SADD(`agency:${agencyId}:likes`, `user:${userId}`);
      return { result: sortedSet.toString(result) };
    }
    if (operation === "decrease") {
      const result = await client.SREM(`agency:${agencyId}:likes`, `user:${userId}`);
      return { result: sortedSet.toString(result) };
    }
    // Invalid Operation
    return { result: "failed" };
  }

  getArea(addressName) {
    const split = addressName.split(" ");
    return split.slice(0, split.length - 2).join(" ");
  }

  async isPassed24Hours(agencyId, userId) {
    const lastViewTime = await client.HGET(`agency:${agencyId}:last_view_time`, `user:${userId}`);
    const currentTime = new Date().getTime() / 1000;
    return currentTime - lastViewTime > 24 * 3600;
  }

  isEmpty(agency) {
    return !agency.id || !agency.y || !agency.x || !agency.place_name || !agency.address_name;
  }

  async _isValidOperation(operation, ids) {
    const { agencyId, userId } = ids;
    const isUserLikeThisAgency = await this.getLikes(agencyId, userId);
    if (isUserLikeThisAgency && operation === "decrease") return true; //valid
    if (!isUserLikeThisAgency && operation === "increase") return true; //valid
    // Otherwise invalid
    return false;
  }
};

function flush() {
  baseTime = new Date().toLocaleDateString();
  client.multi().DEL("realtime_agencies_views").DEL("realtime_area_views").exec();
}
setInterval(flush, 24 * 3600 * 1000);
