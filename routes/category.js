const express = require("express");
const router = express.Router();

const {
    create,
    categoryById,
    view,
    update,
    remove,
    list
} = require("../controllers/category");
const { requireLogin, isAuth, isAdmin } = require("../controllers/auth");
const { userById } = require("../controllers/user");

router.get("/category/:categoryId", view);
router.post("/category/create/:userId", requireLogin, isAuth, isAdmin, create);
router.put(
    "/category/:categoryId/:userId",
    requireLogin,
    isAuth,
    isAdmin,
    update
);

router.delete(
    "/category/:categoryId/:userId",
    requireLogin,
    isAuth,
    isAdmin,
    remove
);
router.get("/categories", list);

router.param("categoryId", categoryById);
router.param("userId", userById);

module.exports = router;
