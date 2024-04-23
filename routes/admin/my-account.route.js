const express = require("express");
const router = express.Router();

// có router phải tạo controller
const controller = require("../../controllers/admin/my-account.controller");

router.get('/', controller.index);

module.exports = router;
