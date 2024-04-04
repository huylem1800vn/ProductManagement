const Product = require("../../models/product.model");

// [GET] /products/
// models là folder chứa các file dùng để truy vấn các database
// controller dùng để chọc vào model để lấy data 
// database trong đó

module.exports.index = async (req, res) => {
  const products = await Product
  .find({
    status: "active",
    deleted: false
  })
  .sort({ position: "desc" });

  for (const item of products) {
    item.priceNew = 
    (item.price * (100 - item.discountPercentage) / 100).toFixed(0); 
  };

  res.render("client/pages/products/index", 
  {
    pageTitle : "Danh sách sản phẩm",
    products: products
  }
    )
  };