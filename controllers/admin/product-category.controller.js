const ProductCategory = require("../../models/product-category.model");
const systemConfig = require("../../config/system")
const createTreeHelper = require("../../helpers/createTree.helper");

// [GET] /admin/products-category/
module.exports.index = async (req, res) => {
    // lấy tất cả các bản ghi của products category
    const records = await ProductCategory.find({
        deleted: false,
    })
    
    const newRecords = createTreeHelper(records);

    res.render("admin/pages/products-category/index", {
        pageTitle: "Danh mục sản phẩm",
        records: newRecords,
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
    // chặn người dùng sử dụng postman để gửi db bằng form lên mặc dù không có quyền truy cập
    if(!res.locals.role.permissions.includes("products-category_create")){
        res.send("Không có quyền truy cập.");
        return;
    }
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

// [GET] /admin/products-category/edit/:id
module.exports.edit = async (req, res) => {
    
    try {
        const find = {
            _id: req.params.id,
            deleted: false,
        }

        const data = await ProductCategory.findOne(find);

        const records = await ProductCategory.find({ 
            deleted: false 
        });

        const newRecords = createTreeHelper(records);

        res.render("admin/pages/products-category/edit", {
            pageTitle: "Sửa danh mục sản phẩm",
            data: data,
            records: newRecords,
        });
        

    } catch (error) {
        // để bắt lỗi truyền lại trang danh sách danh mục phòng trường hợp có người truyền lên id sai
        res.redirect(`/${systemConfig.prefixAdmin}/products-category`);
    }
}

// [PATCH] /admin/products-category/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;

    req.body.position = parseInt(req.body.position);

    try {
        await ProductCategory.updateOne({_id: id,}, req.body)
        req.flash("success", `Cập nhật danh mục ${req.body.title} thành công!`)
    } catch (error) {
        // khi người dùng sửa id trên url khiến cho id bị sai thì sẽ bắt vào catch để không bị lỗi hệ thống
        req.flash("error", `Cập nhật danh mục ${req.body.title} không thành công!`)
    }

    res.redirect("back");
}