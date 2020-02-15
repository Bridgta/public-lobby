const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/user");
const { userRegisterValidator } = require("../validator");

router.post("/register", userRegisterValidator, register);
router.post("/login", login);

module.exports = router;
