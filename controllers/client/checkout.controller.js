const Cart = require("../../models/cart.model");
const Order = require("../../models/order.model");
const Product = require("../../models/product.model");

// [GET] /checkout/
module.exports.index = async (req, res) => {
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

// [GET] /checkout/success/:orderId
module.exports.success = async (req, res) => {
    try {
        const oderId = req.params.orderId;

        const order = await Order.findOne({
            _id: oderId,
        })

        order.totalPrice = 0;

        for (const product of order.products) {
            const productInfo = await Product.findOne({
                _id: product.product_id,
            });

            product.title = productInfo.title;
            product.thumbnail = productInfo.thumbnail;
            // lấy giá trong mảng đơn hàng, tại thời điểm người dùng đặt
            product.priceNew = (product.price * (100 - product.discountPercentage)/100).toFixed(0);
            product.totalPrice = product.priceNew * product.quantity;

            order.totalPrice += product.totalPrice;
        }

        // console.log(order);
    
        res.render("client/pages/checkout/success", {
            pageTitle: "Đặt hàng thành công",
            order: order,
        });
    } catch (error) {
        res.redirect("/");
    }
}