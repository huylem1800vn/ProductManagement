const express = require("express");
const multer  = require('multer');
const router = express.Router();

const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

const upload = multer();

// có router phải tạo controller
const controller = require("../../controllers/admin/product-category.controller");

router.get('/', controller.index);

router.get('/create', controller.create);

router.post(
  '/create',
  upload.single('thumbnail'),
  uploadCloud.uploadSingle, 
  controller.createPost
);

router.get('/edit/:id', controller.edit);

module.exports = router;