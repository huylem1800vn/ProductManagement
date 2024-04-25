const Product = require("../../models/product.model");

// [GET] /
module.exports.index = async (req, res) => {
  const productsFeatured = await Product.find({
    deleted: false,
    status: "active",  
    featured: "1",
  }).limit(6).select("-description");// select là lấy ra các trường và cách nhau khoảng trắng,  muốn bỏ trường nào thì cho dấu - trước nó

  for (const product of productsFeatured) {
    product.priceNew = (product.price * (100 - product.discountPercentage)/100).toFixed(0);
  }

  console.log(productsFeatured)
  
  res.render("client/pages/home/index", {
    pageTitle : "Trang chủ",
    productsFeatured: productsFeatured,
  });
};