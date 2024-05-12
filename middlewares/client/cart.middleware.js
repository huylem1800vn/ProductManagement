const Cart = require("../../models/cart.model");

module.exports.cart = async (req, res, next) => {
    const ONE_MONTH = 30 * 24 * 60 * 60 * 1000; // Một tháng tính bằng mili giây
    // lấy cart id trong phần cookie
    // nếu chưa có giỏ hàng thì sẽ tạo môt giỏ hàng mới
    if(!req.cookies.cartId) {
        const cart = new Cart();
        await cart.save();

        // Trả về cookie một biến cartId: cart.id
        // Thiết lập cookie cartId với thời gian hết hạn là 1 tháng, tính từ thời gian lần cuối truy cập
        res.cookie("cartId", cart.id, {
            expires: new Date(Date.now() + ONE_MONTH),
            httpOnly: true, // Đảm bảo cookie chỉ được gửi qua HTTP và không bị truy cập bằng JavaScript
        });
    } else {
        const cart = await Cart.findOne({
            _id: req.cookies.cartId,
        });
        // trả ra một biến miniCart ra locals để tất cả các trang có chạy qua middleware này đều lấy được
        res.locals.miniCart = cart;
    }
    next();
}
