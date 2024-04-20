const Account = require("../../models/account.model");


module.exports.createPost = async (req, res, next) => {
    if(!req.body.fullName) {
        req.flash("error", "Vui lòng nhập họ tên!");
        res.redirect("back");
        return;
      }
    
      if(req.body.fullName.length < 2) {
        req.flash("error", "Vui lòng nhập ít nhất 2 ký tự!");
        res.redirect("back");
        return;
      }

      if(!req.body.email) {
        req.flash("error", "Vui lòng nhập email!");
        res.redirect("back");
        return;
      }
      

      if(!req.body.password) {
        req.flash("error", "Vui lòng nhập password!");
        res.redirect("back");
        return;
      }

      const exitEmail = await Account.findOne({
        email: req.body.email,
        deleted: false,
      });

      if(exitEmail) {
        req.flash("error", "email đã tồn tại!");
        res.redirect("back");
        return;
      }

      next();// biến next dùng để chạy đến hàm tiếp theo
}

module.exports.editPatch = async (req, res, next) => {
  if(!req.body.fullName) {
      req.flash("error", "Vui lòng nhập họ tên!");
      res.redirect("back");
      return;
    }
  
    if(req.body.fullName.length < 2) {
      req.flash("error", "Vui lòng nhập ít nhất 2 ký tự!");
      res.redirect("back");
      return;
    }

    if(!req.body.email) {
      req.flash("error", "Vui lòng nhập email!");
      res.redirect("back");
      return;
    }

    const id = req.params.id;

    // tìm tài khoản có id không bằng id đang xét và có gmail giống với gmail này, là tìm xem còn tài khoản nào khác tài khoản đang sửa mà có gmail giống không
    const exitEmail = await Account.findOne({
      _id: { $ne: id }, // not equal: không bằng
      email: req.body.email,
      deleted: false,
    });

    if(exitEmail) {
      req.flash("error", "email đã tồn tại!");
      res.redirect("back");
      return;
    }

    next();// biến next dùng để chạy đến hàm tiếp theo
}