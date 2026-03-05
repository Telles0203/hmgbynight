const express = require("express");
const router = express.Router();

const { createUser, listUsers } = require("../controllers/userController");

router.post("/create", createUser);
router.get("/list", listUsers);

module.exports = router;