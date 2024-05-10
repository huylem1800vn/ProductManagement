const Cart = require("../../models/cart.model");
const Order = require("../../models/order.model");
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

// [POST] /checkout/order
module.exports.order = async (req, res) => {
    const cartId = req.cookies.cartId;
    const userInfo = req.body;

    const cart = await Cart.findOne({
        _id: cartId,
    });

    const products = [];

    for (const item of cart.products) {
        const product = await Product.findOne({
            _id: item.product_id,
        }).select("-description");

        const objectProduct = {
            product_id: item.product_id,
            price: product.price,
            discountPercentage: product.discountPercentage,
            quantity: item.quantity,
        }

        products.push(objectProduct);
    }

    const dataOrder = {
        // user_id: String,
        cart_id: cartId,
        userInfo: userInfo,
        products: products,
    }

    // chọc vào model Order để tạo một model dạng Order mới và truyền giá trị vào
    const order = new Order(dataOrder);
    await order.save();

    // sau khi đặt hàng thành công thì xoá các sản phẩm đi
    await Cart.updateOne({
        _id: cartId,
    }, {
        products:[],
    })

    res.redirect(`/checkout/success/${order.id}`);
}