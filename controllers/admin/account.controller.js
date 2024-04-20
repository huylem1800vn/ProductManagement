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
    
    res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
}