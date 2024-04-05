const Product = require("../../models/product.model");
const filterHelper = require("../../helpers/filter.helper");
const paginationHelper = require("../../helpers/pagination.helper");
const systemConfig = require("../../config/system");

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
  
  // Pagination (Phân trang) 
  const countRecords = await Product.countDocuments(find);
  // Đếm các document(mỗi bảng ghi là 1 document)
  const objectPagination = paginationHelper(req, countRecords);
  // End Pagination (Phân trang) 

  const products = await Product
  .find(find)
  .limit(objectPagination.limitItems)
  .skip(objectPagination.skip)
  .sort({ position: "desc" });
  // desc là giảm dần, asc mặc định là tăng dần

  // Chọc vào model Product trả ra tất cả các bản ghi trong database theo điều kiện, nếu không có điều kiện thì trả ra hết

  res.render("admin/pages/products/index", 
    {
      pageTitle : "Danh sách sản phẩm",
      products: products,
      filterStatus: filterStatus,
      keyword: req.query.keyword,
      objectPagination: objectPagination,
      prefixAdmin: systemConfig.prefixAdmin
    }
    )
  };

// [PATCH] /admin/products/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;

  await Product.updateOne({
    _id: id
  }, {
    status: status
  });// Tìm bản ghi có id và update status

  req.flash('success', 'Cập nhật trạng thái thành công!');
  // khi load lại trang sẽ mất đi biến thông báo, khi dùng flash sẽ được lưu biến vào cookie một thời gian để thông báo
  
  res.redirect(`back`);// back về trang trước
}

// [PATCH] /admin/products/change-multi
// tính năng này chấm 2 điểm
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  let ids = req.body.ids;// lấy danh sách các id ở dạng chuỗi
  ids = ids.split(", ");// chuyển dạng chuỗi thành dạng mảng

  switch (type) {
    case "active":
    case "inactive":// gom case
      await Product.updateMany({
        _id: {$in: ids} 
        // tìm những bản ghi có id nằm trong mảng ids, $in là bên trong
      }, {
        status: type
      });
      // Tìm bản ghi có id và update status
      req.flash('success', 'Cập nhật trạng thái thành công!');
      break;
    case "delete-all":
      await Product.updateMany({
        _id: {$in: ids} 
      }, {
        deleted: true
      });
      req.flash('success', 'Xoá sản phẩm thành công!');
      break;
    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split("-");// phá vỡ cấu trúc
        position = parseInt(position);// vì position là kiểu number nên phải chuyển chuỗi sang number
        await Product.updateOne({
          _id: id
        }, {
          position: position
        })
      }
      break;
    default:
      break;
  }
  res.redirect("back");
}

// [DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;

  await Product.updateOne({
    _id: id
  }, {
    deleted: true
  });

  req.flash('success', 'Xoá sản phẩm thành công!');

  res.redirect("back");
}

  
  