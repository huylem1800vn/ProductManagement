const Product = require("../../models/product.model");

// [GET] /admin/dashboard
module.exports.index = async (req, res) => {  
  const statistic = {
    categoryProduct: {
      total: 0,
    active: 0,
    inactive: 0,
    },
    product: {
      total: 0,
    active: 0,
    inactive: 0,
    },
    account: {
      total: 0,
    active: 0,
    inactive: 0,
    },
    user: {
      total: 0,
    active: 0,
    inactive: 0,
    },
  };

  // hàm countDocuments đếm xem có bao nhiêu bản ghi chưa bị xoá
  statistic.product.total = await Product.countDocuments({
    deleted: false,
  });

  // tìm bản ghi có trạng thái active
  statistic.product.active = await Product.countDocuments({
    deleted: false,
    status: "active",
  });

  // tìm bản ghi có trạng thái inactive
  statistic.product.inactive = await Product.countDocuments({
    deleted: false,
    status: "inactive",
  });

  console.log(statistic);
  
    

    res.render("admin/pages/dashboard/index", {
      pageTitle : "Tramg tổng quan",
      statistic: statistic,
    });
  };