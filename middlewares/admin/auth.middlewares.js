const systemConfig = require("../../config/system");
const Account = require("../../models/account.model");
const Role = require("../../models/role.model");

module.exports.requireAuth = async (req, res, next) => {
    // Kiểm tra xem có tồn tại cookie để cho người dùng đăng nhập vào trang quản trị
    if(!req.cookies.token) {
        res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
        return;
    }

    const user = await Account.findOne({
        token: req.cookies.token,
        deleted:false,
        status: "active",
    })

    if(!user) {
        res.clearCookie("token");
        res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
        return;
    }

    const role = await Role.findOne({
        _id: user.role_id,
        deleted: false,
    });

    res.locals.user = user;// biến user toàn cục
    res.locals.role = role;

    next();
}