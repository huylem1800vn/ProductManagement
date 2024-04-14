const ProductCategory = require("../../models/product-category.model");
const systemConfig = require("../../config/system")
const createTreeHelper = require("../../helpers/createTree.helper");

// [GET] /admin/products-category/
module.exports.index = async (req, res) => {
    // lấy tất cả các bản ghi của products category
    const records = await ProductCategory.find({
        deleted: false,
    })
    
    res.render("admin/pages/products-category/index", {
        pageTitle: "Danh mục sản phẩm",
        records: records,
    });
};

// [GET] /admin/products-category/create
module.exports.create = async (req, res) => {
    const records = await ProductCategory.find({
        deleted: false,
    });

    const newRecords = createTreeHelper(records);// tạo ra cây lồng nhau

    // console.log(newRecords);

    res.render("admin/pages/products-category/create", {
        pageTitle: "Thêm mới danh mục sản phẩm",
        records: newRecords,
    });
};

// [POST] /admin/products-category/create
module.exports.createPost = async (req, res) => {
    if(req.body.position){
        req.body.position = parseInt(req.body.position);
    } else {
        const count = await ProductCategory.countDocuments();// Đếm tổng số bản ghi trong database 
        req.body.position = count + 1;
    }

    const record = new ProductCategory(req.body);
    await record.save();

    req.flash("success", `Thêm mới danh mục: ${req.body.title} thành công`);
  res.redirect(`/${systemConfig.prefixAdmin}/products-category`);
    
};