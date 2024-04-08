const express = require("express");
const multer  = require('multer');
const router = express.Router();
const validate = require("../../validates/admin/product.validate");

const storage = require("../../helpers/storageMulter.helper");
const upload = multer({ storage: storage });

// có router phải tạo controller
const controller = require("../../controllers/admin/product.controller");

router.get('/', controller.index);

router.patch('/change-status/:status/:id', controller.changeStatus);
// :status là định nghĩa 1 param động
// Phương thức patch không update bằng link url mà chỉ update bằng nút, patch là phương thức cập nhật, get là phương thức lấy ra

router.patch('/change-multi', controller.changeMulti);

router.delete("/delete/:id", controller.deleteItem);

router.get("/create", controller.create);// giao diện thêm mới

router.post(
    "/create", 
    upload.single('thumbnail'),
    validate.createPost, 
    controller.createPost
    );// upload.single('thumbnail') đứng từ biến upload gọi vào hàm single, single dùng để upload 1 ảnh xử lý update file trong input có name là thumbnail

router.get("/edit/:id", controller.edit);

router.patch(
    "/edit/:id", 
    upload.single('thumbnail'),
    validate.createPost, 
    controller.editPatch
    );
// phương thức patch là method override

router.get("/detail/:id", controller.detail);

module.exports = router;

  