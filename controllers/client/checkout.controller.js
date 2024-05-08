const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");

// [GET] /checkout/
module.exports.index = async (req, res) => {
    try {
        const cart = await Cart.findOne({
            _id: req.cookies.cartId,
        });

        cart.totalPrice = 0;

        for (const item of cart.products) {
            const infoProduct = await Product.findOne({
                _id: item.product_id,
            }).select("thumbnail title price discountPercentage stock slug");

            // tính giá mới
            infoProduct.priceNew = (infoProduct.price * (100 - infoProduct.discountPercentage)/100).toFixed(0);

            // tính tổng tiền
            infoProduct.totalPrice = infoProduct.priceNew * item.quantity;
            
            // tính tổng tiền của tất cả các sản phẩm
            cart.totalPrice += infoProduct.totalPrice;

            item.infoProduct = infoProduct;
        }
            
        res.render("client/pages/checkout/index", {
            pageTitle: "Đặt hàng",
            cartDetail: cart,
        });

    } catch (error) {
        req.flash("error", "Giỏ hàng không tồn tại!");
        res.redirect("/");
    }

    
}