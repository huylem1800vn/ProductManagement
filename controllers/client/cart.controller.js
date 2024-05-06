const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");


// [GET] /cart/
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
            
        res.render("client/pages/cart/index", {
            pageTitle: "Giỏ hàng",
            cartDetail: cart,
    });

    } catch (error) {
        req.flash("error", "Giỏ hàng không tồn tại!");
        res.redirect("/");
    }
};

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

// [GET] /delete/:productId
module.exports.deleteItem = async (req, res) => {
    const productId = req.params.productId;
    const cartId = req.cookies.cartId;
    
    await Cart.updateOne({
        _id: cartId,
    }, {
        // gửi lên Id sản phẩm, tìm giỏ hàng của bản ghi sản phẩm, xoá sản phẩm có product id cần xoá
        // pull là xoá bản ghi, còn push là thêm bản ghi vào object
        $pull: { products: {product_id: productId} }
    })
    req.flash ("success", `Đã xoá sản phẩm khỏi giỏ hàng!`);

    res.redirect("back");
}