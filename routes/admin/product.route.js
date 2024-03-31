const express = require("express");
const router = express.Router();

// có router phải tạo controller
const controller = require("../../controllers/admin/product.controller");

router.get('/', controller.index);
router.get('/:status/:id', controller.changeStatus);
// :status là định nghĩa 1 param động
module.exports = router;

  