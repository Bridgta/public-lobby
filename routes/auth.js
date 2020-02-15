const express = require("express");
const router = express.Router();

const {
    register,
    login,
    logout,
    requireLogin
} = require("../controllers/auth");
const { userRegisterValidator } = require("../validator");

router.post("/register", userRegisterValidator, register);
router.post("/login", login);
router.get("/logout", logout);

module.exports = router;
