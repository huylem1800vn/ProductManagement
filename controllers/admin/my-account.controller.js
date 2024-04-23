// [GET] /admin/my-account/
module.exports.index = (req, res) => {
    res.render("admin/pages/my-account/index", {
      pageTitle : "Tramg thông tin cá nhân"
    });
  };