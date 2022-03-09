const express = require("express");
const router = express.Router();
const httpStatus = require("http-status-codes");

const DAL = require("../../data-access/reviews/likes");
const { InvalidInputError } = require("../../errors");

const addUser = async (req, res) => {
  try {
    const result = await DAL.addUser(req.params.id, req.body);
    res.json(result);
  } catch (err) {
    if (err instanceof InvalidInputError) {
      res.status(httpStatus.StatusCodes.BAD_REQUEST).send({
        error: httpStatus.getReasonPhrase(httpStatus.StatusCodes.BAD_REQUEST),
      });
    } else {
      res.status(httpStatus.StatusCodes.SERVICE_UNAVAILABLE).send({
        error: httpStatus.getReasonPhrase(httpStatus.StatusCodes.SERVICE_UNAVAILABLE),
      });
    }
  }
};

router.put("/:id/likes", addUser);

module.exports = router;
