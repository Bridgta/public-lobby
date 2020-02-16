const express = require("express");
const router = express.Router();

const {
    create,
    projectById,
    view,
    remove,
    update
} = require("../controllers/project");
const { requireLogin, isAuth, isAdmin } = require("../controllers/auth");
const { userById } = require("../controllers/user");

router.get("/project/:projectId", view);
router.post("/project/create/:userId", requireLogin, isAuth, isAdmin, create);
router.delete(
    "/project/:projectId/:userId",
    requireLogin,
    isAuth,
    isAdmin,
    remove
);
router.put(
    "/project/:projectId/:userId",
    requireLogin,
    isAuth,
    isAdmin,
    update
);

router.param("userId", userById);
router.param("projectId", projectById);

module.exports = router;
