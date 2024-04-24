const ProductCategory = require("../../models/product-category.model");

const createTreeHelper = require("../../helpers/createTree.helper");

module.exports.category = async (req, res, next) => {
    const productCategory = await ProductCategory.find({
        deleted: false,
        status: "active",
      })
    
      const newProductCategory = createTreeHelper(productCategory);
      
      // biến toàn cục này nếu viết bên controller hay route con, thì biến đó chỉ tồn tại trong phạm vi đó thôi, chứ không tồn tại trong tất cả các trang, nên phải cho tất cả các trang chạy qua middleware này 
      res.locals.layoutProductCategory = newProductCategory;
    next();
}