const Product = require("../../models/product.model");

// [GET] /admin/products/

module.exports.index = async (req, res) => {
  const find = {
    deleted: false,
  }

  const filterStatus = [
    {
      name: "Tất cả",
      status: "",
      class: "",
    },
    {
      name: "Hoạt động",
      status: "active",
      class: "",
    },
    {
      name: "Dừng hoạt động",
      status: "inactive",
      class: "",
    }
  ];// mảng chứa các phần tử button trong trang products

  // Filter tìm kiếm bằng status, gắn class active
  if(req.query.status) {
    const index = filterStatus.findIndex(item => item.status == req.query.status);// tìm trong mảng filterStatus có bản ghi status bằng với bản ghi nào có status bằng item.status và trả về index của bản ghi đó
    filterStatus[index].class = "active";
  } else {
    const index = filterStatus.findIndex(item => item.status == "");
    filterStatus[index].class = "active";
  }

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

  
  