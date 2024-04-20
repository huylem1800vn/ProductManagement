const express = require("express");
const router = express.Router();
const multer  = require('multer');// multer xử dụng cho up ảnh
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

const upload = multer();

// có router phải tạo controller
const controller = require("../../controllers/admin/account.controller");

const validate = require("../../validates/admin/account.validate");


router.get('/', controller.index);

router.get('/create', controller.create);

router.post(
    '/create',
    upload.single('avatar'), 
    uploadCloud.uploadSingle,
    validate.createPost,
    controller.createPost
);

module.exports = router;

  