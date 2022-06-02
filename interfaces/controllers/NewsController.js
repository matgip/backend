const { StatusCodes } = require("http-status-codes");

const NewsExternalAPI = require("../external/news");

const get = async (req, res) => {
  try {
    const news = await NewsExternalAPI.get({ keyword: req.query.keyword, size: req.query.size });
    res.json(news);
  } catch (err) {
    console.error(err);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

module.exports = {
  get,
};
