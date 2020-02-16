const express = require("express");
const router = express.Router();

const { create, projectById, view } = require("../controllers/project");
const { requireLogin, isAuth, isAdmin } = require("../controllers/auth");
const { userById } = require("../controllers/user");

router.get("/project/:projectId", view);
router.post("/category/create/:userId", requireLogin, isAuth, isAdmin, create);

router.param("userId", userById);
router.param("projectId", projectById);

module.exports = router;
