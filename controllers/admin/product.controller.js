const Product = require("../../models/product.model");

// [GET] /admin/products/

module.exports.index = async (req, res) => {
  const products = await Product.find({
    deleted: false,
  });// Trả ra tất cả các bản ghi trong database

  console.log(products);

  res.render("admin/pages/products/index", 
    {
      pageTitle : "Tramg danh sách sản phẩm",
      products: products
    }
    )
  };