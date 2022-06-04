const { StatusCodes } = require("http-status-codes");
const axios = require("axios");

const AgencyRepository = require("../../infrastructure/repositories/agency");
const MapCacheRepository = require("../../infrastructure/repositories/map-cache");

const getAgency = async (req, res) => {
  try {
    const agency = await AgencyRepository.get(req.params.agencyId);
    if (AgencyRepository.isEmpty(agency) === true) {
      res.sendStatus(StatusCodes.NO_CONTENT);
      return;
    }
    res.json(agency);
  } catch (err) {
    console.error(err);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const getViews = async (req, res) => {
  try {
    const agencyViews = await AgencyRepository.getViews(req.params.agencyId);
    res.json(agencyViews);
  } catch (err) {
    console.error(err);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const getLikes = async (req, res) => {
  try {
    const agencyLikes = await AgencyRepository.getLikes(req.params.agencyId, req.query.userId);
    res.json(agencyLikes);
  } catch (err) {
    console.error(err);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const getTopHitAgencies = async (req, res) => {
  try {
    const topHitAgencies = await AgencyRepository.getTopHitAgencies(req.query);
    res.json(topHitAgencies);
  } catch (err) {
    console.error(err);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const getTopHitAreas = async (req, res) => {
  try {
    const topHitAreas = await AgencyRepository.getTopHitAreas(req.query);
    res.json(topHitAreas);
  } catch (err) {
    console.error(err);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const addAgency = async (req, res) => {
  try {
    await AgencyRepository.persist(req.body);
    res.sendStatus(StatusCodes.OK);
  } catch (err) {
    console.error(err);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const updateViews = async (req, res) => {
  try {
    await AgencyRepository.mergeViews(req.body);
    res.sendStatus(StatusCodes.OK);
  } catch (err) {
    console.error(err);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const updateLikes = async (req, res) => {
  try {
    const result = await AgencyRepository.mergeLikes(req.params.agencyId, req.body);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const KAKAO_REST_KEY = "b912a737eb064082f1aff5d3600bc2be";

const getUrl = (keyword, x, y, radius, page) => {
  const url =
    keyword.length !== 0
      ? `https://dapi.kakao.com/v2/local/search/keyword.json?category\_group\_code=AG2&query=${keyword}&radius=${radius}&page=${page}`
      : `https://dapi.kakao.com/v2/local/search/category.json?category\_group\_code=AG2&x=${x}&y=${y}&radius=${radius}&page=${page}`;
  return encodeURI(url);
};

const kakaoSearch = async (keyword, x, y, radius, page = 1) => {
  const response = await axios({
    method: "GET",
    url: getUrl(keyword, x, y, radius, page),
    headers: {
      Authorization: `KakaoAK ${KAKAO_REST_KEY}`,
    },
  });
  return response.data;
};

const search = async (req, res) => {
  const y = typeof req.query.y === "undefined" ? -1 : req.query.y;
  const x = typeof req.query.x === "undefined" ? -1 : req.query.x;
  const keyword = typeof req.query.keyword === "undefined" ? "" : req.query.keyword;

  const radius = 710;

  if (y > 0 && x > 0 && (await MapCacheRepository.findPlace({ lat: y, lng: x })) === null) {
    try {
      await MapCacheRepository.persistPlace({ lat: y, lng: x });

      let nextPage = 1;
      while (true) {
        const data = await kakaoSearch(keyword, x, y, radius, nextPage++);

        await Promise.all(
          data.documents.map(async (doc) => {
            await AgencyRepository.persist(doc);
          })
        );

        if (data.meta.is_end) break;
      }
    } catch (err) {
      console.error(err);
      res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
  } else if (keyword && (await MapCacheRepository.findKeyword(keyword)) === null) {
    try {
      await MapCacheRepository.persistKeyword(keyword);

      let nextPage = 1;
      while (true) {
        const data = await kakaoSearch(keyword, x, y, radius, nextPage++);

        await Promise.all(
          data.documents.map(async (doc) => {
            await AgencyRepository.persistAgencyByKeyword(keyword, doc.id);
            await AgencyRepository.persist(doc);
          })
        );

        if (data.meta.is_end) break;
      }
    } catch (err) {
      console.error(err);
      res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  try {
    const agencies =
      keyword.length !== 0
        ? await AgencyRepository.searchByKeyword(keyword)
        : await AgencyRepository.searchByRadius(y, x, radius);
    res.json(agencies);
  } catch (err) {
    console.error(err);
    res.sendStatus(StatusCodes.BAD_REQUEST);
  }
};

module.exports = {
  getAgency,
  getViews,
  getLikes,
  getTopHitAgencies,
  getTopHitAreas,
  addAgency,
  updateViews,
  updateLikes,
  search,
};
