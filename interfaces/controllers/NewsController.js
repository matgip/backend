const { StatusCodes } = require("http-status-codes");

const NewsExternalAPI = require("../external/news");

const get = async (req, res) => {
  try {
    const keyword = req.query.keyword;
    const size = req.query.size;
    const news = await NewsExternalAPI.get({ keyword, size });
    res.json(news);
  } catch (err) {
    console.error(err);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

module.exports = {
  get,
};
