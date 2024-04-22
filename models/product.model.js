const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const productSchema = new mongoose.Schema({
    title: String,
    product_category_id: String,
    description: String,
    price: Number,
    discountPercentage: Number,
    stock: Number,
    thumbnail: String,
    status: String,
    position: Number,
    slug: {
        type: String,
        slug: "title",
        unique: true // slug là duy nhất
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date,
    deletedBy: String,
    createdBy: String,
    updatedBy: String,
}, {
    timestamps: true// thêm trường createdAt với updatedAt vào db
});

const Product = mongoose.model("Product", 
productSchema, "products");

module.exports = Product;