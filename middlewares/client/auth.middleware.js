const User = require("../../models/user.model");

module.exports.requireAuth = async (req, res, next) => {
    // Kiểm tra xem có tồn tại cookie để cho người dùng đăng nhập vào trang quản trị
    if(!req.cookies.tokenUser) {
        res.redirect(`/user/login`);
        return;
    }

    const user = await User.findOne({
        tokenUser: req.cookies.tokenUser,
        deleted:false,
        status: "active",
    })

    if(!user) {
        res.clearCookie("tokenUser");
        res.redirect(`/user/login`);
        return;
    }

    next();
}