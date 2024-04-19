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

// [POST] admin/roles/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const data = await Role.findOne(
            {
                _id: req.params.id,
                deleted: false,
            });

        res.render("admin/pages/roles/edit", {
            pageTitle: "Chỉnh sửa nhóm quyền",
            data: data,
        })
        
    } catch (error) {
        req.flash("error", "sai id nhóm quyền này!");

        res.redirect(`/${systemConfig.prefixAdmin}/roles`);
    }
}

// [PATCH] admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {
    try {
        // tìm hiểu về điểm khác nhau giữa: role = await Role.updateOne
        await Role.updateOne(
            {
                _id: req.params.id,
            },
            req.body
        )

        req.flash("success", `Cập nhật nhóm quyền: ${req.body.title} thành công!`);
    } catch (error) {
        req.flash("error", `Cập nhật nhóm quyền: ${req.body.title} không thành công!`);
    }

    res.redirect(`/${systemConfig.prefixAdmin}/roles`);
}

// [GET] admin/roles/permissions
module.exports.permissions = async (req, res) => {
    // Find 
    let find = {
        deleted: false,
    };
    // End Find

    const records = await Role.find(find);

    res.render("admin/pages/roles/permissions", {
        pageTitle: "Phân quyền",
        records: records
    })
}

// [PATCH] admin/roles/permissions
module.exports.permissionsPatch = async (req, res) => {
    // req.body là chỗi json bên frontend do req.body là giá trị của form được submit, cụ thể là giá trị role của ô input
    // convert về dạng js
    const roles = JSON.parse(req.body.roles);
    console.log(roles);

    for (const role of roles) {
        await Role.updateOne({
            _id: role.id,
            deleted: false
        }, {
            permissions: role.permissions,
        })
    }

    req.flash("success", "Cập nhật phân quyền thành công!");

    res.redirect("back");
}