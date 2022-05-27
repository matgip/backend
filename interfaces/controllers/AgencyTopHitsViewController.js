const { StatusCodes } = require("http-status-codes");

const AgencyTopHitsRepository = require("../../infrastructure/repositories/agency-top-hits");

const get = async (req, res) => {
  try {
    const top15HitsAgencies = await AgencyTopHitsRepository.get(req.query);
    res.json(top15HitsAgencies);
  } catch (err) {
    console.error(err);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

module.exports = {
  get,
};
