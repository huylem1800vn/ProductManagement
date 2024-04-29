const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");


// [GET] /search/:keyword
module.exports.index = async (req, res) => {
    const keyword = req.query.keyword;

    const regexKeyword = new RegExp(keyword, "i");
    
    // tìm tương đối tiêu đề có regexKeyword, còn để keyword thì sẽ tìm đúng tên mới hiển thị
    const products = await Product.find({
        title: regexKeyword,
        deleted: false,
        status: "active",
    })

    for (const item of products) {
        item.priceNew = (item.price * (100 - item.discountPercentage)/100).toFixed(0);
    }

    res.render("client/pages/search/index", {
        pageTitle: "Kết quả tìm kiếm",
        keyword: keyword,
        products: products,
    });
};