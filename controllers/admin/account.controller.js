const md5 = require("md5");
const Account = require("../../models/account.model");
const Role = require("../../models/role.model");

const generateHelper = require("../../helpers/generate.helper");
const systemConfig = require("../../config/system");


// [GET] /admin/accounts
module.exports.index = async (req, res) => {
    // Find
    let find = {
        deleted: false,
    };
    // End Find
    const records = await Account.find(find);

    // vòng lặp forEach không dùng được từ khoá await nên bắt buộc phải dùng for of
    for (const record of records) {
      const role = await Role.findOne({
        _id: record.role_id,
        deleted: false,
      });
      // gắn thêm thuộc tính roleTitle vào object record để in ra bên giao diện
      record.roleTitle = role.title;
    }
    // console.log(records);

    res.render("admin/pages/accounts/index", {
      pageTitle : "Danh sách tài khoản",
      records: records,
    });
  };

// [GET] /admin/accounts/create
module.exports.create = async (req, res) => {
    const roles = await Role.find({
        deleted: false,
    })
    
    res.render("admin/pages/accounts/create", {
      pageTitle : "Thêm mới tài khoản",
      roles: roles,
    });
  };

// [POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {
    req.body.password = md5(req.body.password);

    req.body.token = generateHelper.generateRandomString(30);

    // console.log(req.body);

    const account = new Account(req.body);
    await account.save();
    
    req.flash("access", "Tạo tài khoản thành công");
    res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
}

// [GET] /admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
  const find = {
    _id: req.params.id,
    deleted: false,
  };

  try {
    const data = await Account.findOne(find);

    const roles = await Role.find({
      deleted: false,
    })

    res.render("admin/pages/accounts/edit", {
      pageTitle: "Chỉnh sửa tài khoản",
      data: data,
      roles: roles,
    })
    
  } catch (error) {
    req.flash("error", "Sai id tài khoản!");
    res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
  }
}

// [PATCH] /admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
  if(req.body.password) {
    req.body.password = md5(req.body.password);
  } else {
    // xoá trường password vì nếu người dùng không nhập, thì pass sẽ gửi lên db là rỗng nên phải xoá
    delete req.body.password;
  }
  try {
    await Account.updateOne({
      _id: req.params.id,
      deleted: false,
    }, req.body);
    req.flash("success", "Cập nhật thành công!");
    res.redirect("back");
  } catch (error) {
    req.flash("error", "id không đúng!");
    res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
  }
  // console.log(req.params.id);
  // console.log(req.body);
}