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

  mergeViews(reqEntity) {
    throw new Error("ERR_METHOD_NOT_IMPLEMENTED");
  }
};
