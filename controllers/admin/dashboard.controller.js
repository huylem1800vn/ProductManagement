const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
const Account = require("../../models/account.model");
const User = require("../../models/user.model");

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
  
  // đếm bản ghi categoryProduct
  statistic.categoryProduct.total = await ProductCategory.countDocuments({
    deleted: false,
  });

  // đếm bản ghi active categoryProduct
  statistic.categoryProduct.active = await ProductCategory.countDocuments({
    deleted: false,
    status: "active",
  });

  // đếm bản ghi inactive categoryProduct
  statistic.categoryProduct.inactive = await ProductCategory.countDocuments({
    deleted: false,
    status: "inactive",
  });

  // đếm bản ghi account
  statistic.account.total = await Account.countDocuments({
    deleted: false,
  });

  // đếm bản ghi active account
  statistic.account.active = await Account.countDocuments({
    deleted: false,
    status: "active",
  });

  // đếm bản ghi inactive account
  statistic.account.inactive = await Account.countDocuments({
    deleted: false,
    status: "inactive",
  });

   // đếm bản ghi user
   statistic.user.total = await User.countDocuments({
    deleted: false,
  });

  // đếm bản ghi active user
  statistic.user.active = await User.countDocuments({
    deleted: false,
    status: "active",
  });

  // đếm bản ghi inactive user
  statistic.user.inactive = await User.countDocuments({
    deleted: false,
    status: "inactive",
  });

    res.render("admin/pages/dashboard/index", {
      pageTitle : "Tramg tổng quan",
      statistic: statistic,
    });
  };