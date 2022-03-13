const { StatusCodes } = require("http-status-codes");

const DAL = require("../../infrastructure/repositories/reviews/time");

const add = async (req, res) => {
  try {
    await DAL.addUser(req.params.id, req.body);
    res.sendStatus(StatusCodes.OK);
  } catch (err) {
    console.error(err);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

module.exports = {
  add,
};
