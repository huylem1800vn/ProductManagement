const homeRoutes = require("./home.route");
const productRoutes = require("./product.route");
const searchRoutes = require("./search.route");
const cartRoutes = require("./cart.route");
const checkoutRoutes = require("./checkout.route");
const userRoutes = require("./user.route");
const categoryMiddleware = require("../../middlewares/client/category.middleware");
const cartMiddleware = require("../../middlewares/client/cart.middleware");
const userMiddleware = require("../../middlewares/client/user.middleware");
const settingMiddleware = require("../../middlewares/client/setting.middleware");

module.exports = (app) => {
    // để tất cả các trang đều chạy qua middleware này
    app.use(categoryMiddleware.category);

    // để tất cả các trang đều chạy qua middleware này
    app.use(userMiddleware.infoUser);

    // để tất cả các trang đều chạy qua middleware này
    app.use(cartMiddleware.cart);

    // để tất cả các trang đều chạy qua middleware này
    app.use(settingMiddleware.settingGeneral);

    app.use('/', homeRoutes);
    
    app.use('/products', productRoutes);

    app.use('/search', searchRoutes);

    app.use('/cart', cartRoutes);

    app.use('/checkout', checkoutRoutes);

    app.use('/user', userRoutes);
}

