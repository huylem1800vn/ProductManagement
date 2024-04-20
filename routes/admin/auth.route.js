const express = require("express");
const router = express.Router();

// có router phải tạo controller
const controller = require("../../controllers/admin/auth.controller");

router.get('/login', controller.login);

router.post('/login', controller.loginPost);

module.exports = router;