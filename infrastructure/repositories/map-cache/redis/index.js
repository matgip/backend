const client = require("../../../config/redis/client");
const MapCacheRepository = require("../../../../domain/MapCacheRepository");

const SCANNED = 1;
const SEARCHED = 2;

module.exports = class extends MapCacheRepository {
  constructor() {
    super();
  }

  async persistPlace(latLng) {
    const { lat, lng } = latLng;
    await client.SET(`cached_places:${lat}:${lng}`, SCANNED);
  }

  async persistKeyword(keyword) {
    await client.SET(`cached_keyword:${keyword}`, SEARCHED);
  }

  async findPlace(latLng) {
    const { lat, lng } = latLng;
    return await client.GET(`cached_places:${lat}:${lng}`, 0);
  }

  async findKeyword(keyword) {
    return await client.GET(`cached_keyword:${keyword}`, 0);
  }
};
