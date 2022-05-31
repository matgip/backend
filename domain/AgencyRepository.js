module.exports = class {
  persist(agency) {
    throw new Error("ERR_METHOD_NOT_IMPLEMENTED");
  }

  persistAgencyByKeyword(keyword, agencyId) {
    throw new Error("ERR_METHOD_NOT_IMPLEMENTED");
  }

  searchByKeyword(keyword) {
    throw new Error("ERR_METHOD_NOT_IMPLEMENTED");
  }

  searchByRadius(lat, lng, radius) {
    throw new Error("ERR_METHOD_NOT_IMPLEMENTED");
  }

  get(agencyId) {
    throw new Error("ERR_METHOD_NOT_IMPLEMENTED");
  }

  getViews(agencyId) {
    throw new Error("ERR_METHOD_NOT_IMPLEMENTED");
  }

  getLikes(agencyId) {
    throw new Error("ERR_METHOD_NOT_IMPLEMENTED");
  }

  getTopHitAgencies(query) {
    throw new Error("ERR_METHOD_NOT_IMPLEMENTED");
  }

  getTopHitAreas(query) {
    throw new Error("ERR_METHOD_NOT_IMPLEMENTED");
  }

  mergeViews(reqEntity) {
    throw new Error("ERR_METHOD_NOT_IMPLEMENTED");
  }

  mergeLikes(agencyId, userId) {
    throw new Error("ERR_METHOD_NOT_IMPLEMENTED");
  }
};
