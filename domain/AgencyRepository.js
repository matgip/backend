module.exports = class {
  /**
   * 부동산 정보를 저장합니다.
   * @param {String} agency 부동산 정보
   */
  persist(agency) {
    throw new Error("ERR_METHOD_NOT_IMPLEMENTED");
  }

  /**
   * 키워드 검색 결과 부동산 정보를 저장합니다.
   * @param {String} keyword 검색 키워드
   * @param {String} agencyId 검색 키워드 결과에 일치하는 부동산 Id
   */
  persistAgencyByKeyword(keyword, agencyId) {
    throw new Error("ERR_METHOD_NOT_IMPLEMENTED");
  }

  /**
   * 검색 키워드 기준 반경, 부동산을 검색합니다.
   * @param {String} keyword 검색 키워드
   */
  searchByKeyword(keyword) {
    throw new Error("ERR_METHOD_NOT_IMPLEMENTED");
  }

  /**
   * 매개변수 (위도/경도) 기준, radius 반경으로 부동산을 검색합니다.
   * @param {Float} lat 위도
   * @param {Float} lng 경도
   * @param {number} radius 검색 반경
   */
  searchByRadius(lat, lng, radius) {
    throw new Error("ERR_METHOD_NOT_IMPLEMENTED");
  }

  /**
   * agencyId에 일치하는 부동산 정보를 반환합니다.
   * @param {String} agencyId 부동산 Id
   */
  get(agencyId) {
    throw new Error("ERR_METHOD_NOT_IMPLEMENTED");
  }

  /**
   * agencyId에 일치하는 부동산 조회수를 반환합니다.
   * @param {String} agencyId 검색할 부동산 Id
   */
  getViews(agencyId) {
    throw new Error("ERR_METHOD_NOT_IMPLEMENTED");
  }

  /**
   * agencyId에 일치하는 부동산 '좋아요' 개수를 반환합니다.
   * @param {String} agencyId 검색할 부동산 Id
   */
  getLikes(agencyId) {
    throw new Error("ERR_METHOD_NOT_IMPLEMENTED");
  }

  /**
   * 조회수가 가장 높은 최대 상위 15개 부동산 정보를 반환합니다.
   * @param {String} query Fetch할 부동산 개수(15개)
   */
  getTopHitAgencies(query) {
    throw new Error("ERR_METHOD_NOT_IMPLEMENTED");
  }

  /**
   * 조회수가 높은 지역의 최대 상위 15개 정보를 반환합니다.
   * @param {String} query Fetch할 장소 개수(15개)
   */
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
