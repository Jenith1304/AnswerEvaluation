const express = require("express");
const { register, login, logout, getUserProfile } = require("../controllers/AuthController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile", authMiddleware, getUserProfile); // Protected Route

module.exports = router;
