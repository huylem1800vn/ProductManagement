const Cart = require("../../models/cart.model");

module.exports.cart = async (req, res, next) => {
    // lấy cart id trong phần cookie
    // nếu chưa có giỏ hàng thì sẽ tạo môt giỏ hàng mới
    if(!req.cookies.cartId) {
        const cart = new Cart();
        await cart.save();

        // Trả về cookie một biến cartId: cart.id
        res.cookie("cartId", cart.id);
    }
    

    next();
}
