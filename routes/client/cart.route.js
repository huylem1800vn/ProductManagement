const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/cart.controller");

router.post('/add/:productId', controller.addPost);

router.get('/', controller.index);

router.get('/delete/:productId', controller.deleteItem);

module.exports = router;

  