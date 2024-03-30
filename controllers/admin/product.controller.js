const Product = require("../../models/product.model");
const filterHelper = require("../../helpers/filter.helper");

// [GET] /admin/products/

module.exports.index = async (req, res) => {
  const find = {
    deleted: false,
  }

  // Filter tìm kiếm bằng status, gắn class active
  const filterStatus = filterHelper(req);

  if(req.query.status){
    find.status = req.query.status // Lấy ra giá trị sau dấu ? trên URL gán vào mảng find
  }
  // End Filter 

  // Search tìm kiếm bằng title
  if(req.query.keyword){
    const regex = new RegExp(req.query.keyword, "i");// không quan tâm chữ hoa hay thường
    find.title = regex;
  }
  // End Search 

  const products = await Product.find(find);// Trả ra tất cả các bản ghi trong database theo điều kiện, nếu không có điều kiện thì trả ra hết


  res.render("admin/pages/products/index", 
    {
      pageTitle : "Danh sách sản phẩm",
      products: products,
      filterStatus: filterStatus,
      keyword: req.query.keyword
    }
    )
  };

  
  