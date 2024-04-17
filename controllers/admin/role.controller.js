const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");

// [GET] admin/roles
module.exports.index = async (req, res) => {
    //Find 
    let find = {
        deleted: false,
    };
    // End Find

    const records = await Role.find(find);

    res.render("admin/pages/roles/index", {
        pageTitle: "Nhóm quyền",
        records: records,
    })

}

// [GET] admin/create
module.exports.create = async (req, res) => {
    res.render("admin/pages/roles/create", {
        pageTitle: "Tạo mới nhóm quyền",
    }); 
}

// [POST] admin/create
module.exports.createPost = async (req, res) => {
    const record = new Role(req.body);
    record.save();

    req.flash("success", `Thêm mới quyền: ${req.body.title} thành công`);

    res.redirect(`/${systemConfig.prefixAdmin}/roles`);
}