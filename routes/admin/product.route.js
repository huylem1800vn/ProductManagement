const express = require("express");
const router = express.Router();

// có router phải tạo controller
const controller = require("../../controllers/admin/product.controller");

router.get('/', controller.index);
router.patch('/change-status/:status/:id', controller.changeStatus);
// :status là định nghĩa 1 param động
// Phương thức patch không update bằng link url mà chỉ update bằng nút, patch là phương thức cập nhật, get là phương thức lấy ra
router.patch('/change-multi', controller.changeMulti);
module.exports = router;

  