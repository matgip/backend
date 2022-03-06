const express = require("express");
const router = express.Router();
const httpStatus = require("http-status-codes");

const DAL = require("../data-access/users");

const getUser = async (req, res) => {
  try {
    const result = await DAL.getUser(req.params.id);
    if (result.data === null) {
      res.sendStatus(httpStatus.StatusCodes.NOT_FOUND);
      return;
    }
    res.json(result);
  } catch (err) {
    res.sendStatus(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const addUser = async (req, res) => {
  try {
    await DAL.addUser(req.body);
    res.sendStatus(StatusCodes.OK);
  } catch (err) {
    res.sendStatus(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

router.get("/:id", getUser);
router.post("/", addUser);

module.exports = router;
