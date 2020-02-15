const express = require("express");
const router = express.Router();

const { hello } = require("../controllers/user");

router.get("/", hello);

module.exports = router;
