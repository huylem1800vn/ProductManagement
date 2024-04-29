const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");



// models là folder chứa các file dùng để truy vấn các database
// controller dùng để chọc vào model để lấy data 
// database trong đó
// [GET] /products/
module.exports.index = async (req, res) => {
  const products = await Product
  .find({
    status: "active",
    deleted: false
  })
  .sort({ position: "desc" });

  for (const item of products) {
    item.priceNew = 
    (item.price * (100 - item.discountPercentage) / 100).toFixed(0); 
  };

  res.render("client/pages/products/index", 
  {
    pageTitle : "Danh sách sản phẩm",
    products: products
  }
    )
  };

// [GET] /products/:slugCategory/
module.exports.category = async (req, res) => {
  const slugCategory = req.params.slugCategory;

  const category = await ProductCategory.findOne({
    slug: slugCategory,
    deleted: false,
    status: "active",
  })

  const getSubCategory = async (parent_id) => {
    let allSubs = [];

    const listSub = await ProductCategory.find({
      parent_id: parent_id,
      deleted: false,
      status: "active",
    }).select("id title");

    allSubs = [...listSub];

    for (const sub of listSub) {
      const childs = await getSubCategory(sub.id);
      allSubs = allSubs.concat(childs);
    }

    return allSubs;
  };

  // do hàm getSubCategory là hàm lấy data có tính chất chờ đợi nên ta phải dùng await
  const listSubCategory = await getSubCategory(category.id);
  const listIdSubCategory = listSubCategory.map(item => item.id);

  // console.log(listSubCategory)
  // console.log(listIdSubCategory)

  // tìm và trả ra các sản phẩm trong danh mục con nếu ng dùng chỉ truy cập vào danh mục cha
  const products = await Product.find({
    // { $in:[category.id] } tìm ở trong một mảng
    // cú pháp script syntax ...listIdSubCategoryId
    product_category_id: { $in:[ category.id, ...listIdSubCategory] },
    deleted: false,
    status: "active",
  }).sort({ position: "desc" });

  for (const item of products) {
    item.priceNew = 
    (item.price * (100 - item.discountPercentage) / 100).toFixed(0); 
  };

  res.render("client/pages/products/index-category", 
  {
    pageTitle : category.title,
    products: products,
    category: category,
  });
  };

// [GET] /products/detail/:slug
module.exports.detail = async (req, res) => {
  const slug = req.params.slug;
  
  const product = await Product.findOne({
    slug: slug,
    deleted: false,
    status: "active",
  });

  if(product) {
    res.render("client/pages/products/detail", 
    {
      pageTitle : "Chi tiết sản phẩm",
      product : product
    }
    )
  } else {
    res.redirect("/");
  }


  };





  