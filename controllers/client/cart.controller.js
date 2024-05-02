const Cart = require("../../models/cart.model");


// [POST] /add/:productId
module.exports.addPost = async (req, res) => {
    const productId = req.params.productId;
    // req.body lấy ra một cặp key value trong form
    const quantity = parseInt(req.body.quantity);
    const cartId = req.cookies.cartId;

    try {
        
        const cart = await Cart.findOne({
            _id: cartId,
        });

        // kiểm tra sản phẩm đã tồn tại trong giỏ hàng chưa
        const existProductInCart = cart.products.find(item => item.product_id == productId);

        // nếu tồn tại sản phẩm đã có trong giỏ hàng thì chỉ update lại quantity của sản phẩm
        if(existProductInCart) {
            const quantityUpdate = existProductInCart.quantity + quantity;
            
            await Cart.updateOne({
                _id: cartId,
                "products.product_id": productId,
            }, {
                // set lại trường quantity, cú pháp mongoose
                $set: { "products.$.quantity": quantityUpdate }
            });
        } else {
            const objectCart = {
                product_id: productId,
                quantity: quantity,
            };
    
            await Cart.updateOne({
                _id: cartId,
            }, {
                // $push là thêm 1 phần tử vào mảng giỏ hàng
                $push: { products: objectCart }
            });
        }

        req.flash("success", "Đã thêm sản phẩm vào giỏ hàng");
    } catch (error) {
        req.flash("error", "Thêm sản phẩm vào giỏ hàng không thành công");
    }

    res.redirect("back");
};