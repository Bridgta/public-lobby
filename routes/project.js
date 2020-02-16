const express = require("express");
const router = express.Router();

const {
    create,
    projectById,
    view,
    remove,
    update,
    list,
    listRelated,
    listCategories,
    listBySearch,
    photo
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

router.get("/projects", list);
router.get("/projects/related/:projectId", listRelated);
router.post("/project/by/search", listBySearch);
router.get("/project/photo/:projectId", photo);

router.param("userId", userById);
router.param("projectId", projectById);

module.exports = router;
