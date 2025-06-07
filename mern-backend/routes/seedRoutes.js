// routes/seedRoutes.js
const express = require("express");
const router = express.Router();
const { seedDatabase } = require("../controllers/SeedController");

router.get("/", seedDatabase);

module.exports = router;
