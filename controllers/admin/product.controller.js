const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
const Account = require("../../models/account.model");
const filterHelper = require("../../helpers/filter.helper");
const paginationHelper = require("../../helpers/pagination.helper");
const systemConfig = require("../../config/system");
const createTreeHelper = require("../../helpers/createTree.helper");

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

  // Sort
  const sort = {};
  if(req.query.sortKey && req.query.sortValue) {
    const sortKey = req.query.sortKey;
    const sortValue = req.query.sortValue;
    sort[sortKey] = sortValue;
    // do sortKey là một chuỗi nên phải truyền bằng sort["..."];
  } else {
    sort.position = "desc";
    // sort là một Object có cặp key value là: position: "desc"
  }
  // End Sort

  const products = await Product
  .find(find)
  .limit(objectPagination.limitItems)
  .skip(objectPagination.skip)
  .sort(sort);
  // desc là giảm dần, asc mặc định là tăng dần

  // Chọc vào model Product trả ra tất cả các bản ghi trong database theo điều kiện, nếu không có điều kiện thì trả ra hết

  // hiển thị người tạo sản phẩm
  for (const product of products) {
    const createdBy = await Account.findOne({
      _id: product.createdBy,
    });
    
    // if và 2 toán tử 3 ngôi chức năng giống nhau, mình ghi ra để nhớ các trường hợp
    // if(createdBy) {
    //   product.createdByFullName = createdBy.fullName;
    // };

    // product.createdByFullName = createdBy?.fullName;

    createdBy ? product.createdByFullName = createdBy.fullName : null;
  }
  // End hiển thị người tạo sản phẩm

  // hiển thị người cập nhật phẩm
  for (const product of products) {
    const updatedBy = await Account.findOne({
      _id: product.updatedBy,
    });

    updatedBy ? product.updatedByFullName = updatedBy.fullName : null;
  }
  // End hiển thị người cập nhật phẩm

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

  const infoProduct = await Product.findOne({
    _id: id
  });

  req.flash('success', `Cập nhật trạng thái của sản phẩm ${infoProduct.title} thành công!`);
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
        deleted: true,
        deletedAt: new Date(),
        deletedBy: res.locals.user.id,
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
      req.flash('success', 'Thay đổi vị trí sản phẩm thành công!');
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
    deleted: true,
    deletedAt: new Date(),
    deletedBy: res.locals.user.id,
  });

  req.flash('success', 'Xoá sản phẩm thành công!');

  res.redirect("back");
}

// [POST] /admin/products/garbage
module.exports.garbage = async (req, res) => {
  const find = {
    deleted: true,
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

  // hiển thị người tạo sản phẩm
  for (const product of products) {
    const deletedBy = await Account.findOne({
      _id: product.deletedBy,
    });

    deletedBy ? product.deletedByFullName = deletedBy.fullName : null;
  }
  // End hiển thị người tạo sản phẩm

  res.render("admin/pages/products/garbage", 
    {
      pageTitle : "Danh sách sản phẩm",
      products: products,
      filterStatus: filterStatus,
      keyword: req.query.keyword,
      objectPagination: objectPagination,
      prefixAdmin: systemConfig.prefixAdmin
    }
    )
}

// [DELETE] /admin/products/garbage/delete/:id
module.exports.deleteItemForever = async (req, res) => {
  const id = req.params.id;

  await Product.deleteOne({
    _id: id
  })

  req.flash('success', 'Xoá sản phẩm vĩnh viễn thành công!');

  res.redirect("back");
}

// [DELETE] /admin/products/garbage/restore/:id
module.exports.restore = async (req, res) => {
  const id = req.params.id;

  const product = await Product.findOne({_id: id});
  await Product.updateOne({
    _id: id
  }, {
    deleted: false
  });

  req.flash('success', `Phục hồi sản phẩm: ${product.title}  thành công!`);

  res.redirect("back");
}

// [GET] /admin/products/create
module.exports.create = async (req, res) => {
  const category = await ProductCategory.find({
    deleted: false,
  });

  const newCategory = createTreeHelper(category);

  res.render("admin/pages/products/create", {
    pageTitle: "Thêm mới sản phẩm",
    category: newCategory,
  });
}

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {

  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);
  if(req.body.position){
    req.body.position = parseInt(req.body.position);
  } else {
    const countProduct = await Product.countDocuments();// Đếm tổng số bản ghi trong database 
    req.body.position = countProduct + 1;
  }

  req.body.createdBy = res.locals.user.id;
  
  // khi đẩy lên sever online thì thư mục public là thư mục toàn cục nên không cần phải xét vào thư mục public nữa mà vào thẳng thư mục uploads, phải lấy ra link ảnh để lưu vào database
  // nếu có gửi lên file thì sẽ gắn link ảnh vào thumbnail `/uploads/${req.file.filename}`
  // if(req.file){
  //   req.body.thumbnail = `/uploads/${req.file.filename}`;
  // }
  
  const record = new Product(req.body);// chọc vào model product khởi tạo một bản ghi mới, lưu sản phẩm vào database đầu tiên phải tạo mới 1 bản ghi, tạo một sản phẩm mới nhưng phải dựa trên trường model Product
  await record.save(); // khởi tạo xong lưu bản ghi (record) vào database

  req.flash("success", `Thêm mới sản phẩm ${req.body.title} thành công`);
  res.redirect(`/${systemConfig.prefixAdmin}/products`);
}

// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
  const id = req.params.id;
  const category = await ProductCategory.find({
    deleted: false,
  });


  const newCategory = createTreeHelper(category);

  const product = await Product.findOne({
    _id: id,
    deleted: false,
  })

  // có thông tin vào sản phẩm product thì trả nó ra ngoài giao diện qua res.render
  res.render("admin/pages/products/edit", {
    pageTitle: "Chỉnh sửa sản phẩm",
    product: product,
    category: newCategory,
  });
}

// [POST] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;

  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);
  req.body.position = parseInt(req.body.position);
  req.body.updatedBy = res.locals.user.id;
  
  // if(req.file){
  //   req.body.thumbnail = `/uploads/${req.file.filename}`;
  // }

  await Product.updateOne({
    _id: id,
    deleted: false,
  }, req.body);
  // bởi vì biến req.body là một Object rồi
  
  req.flash("success", "Cập nhật sản phẩm thành công");
  res.redirect(`back`);
}

// [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
  const id = req.params.id;

  const product = await Product.findOne({
    _id: id,
    deleted: false,
  })

  // có thông tin vào sản phẩm product thì trả nó ra ngoài giao diện qua res.render
  res.render("admin/pages/products/detail", {
    pageTitle: `Sản phẩm: ${product.title}`,
    product: product,
  });
}


  