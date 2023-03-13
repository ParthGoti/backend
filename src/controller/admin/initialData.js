const Category = require("../../model/category");
const Product = require("../../model/product");



function filterCategories(categories, parentid = null) {
    const categoryList = [];
    let category;
    if (parentid == null) {
      category = categories.filter((cat) => cat.parentid == undefined);
    } else {
      category = categories.filter((cat) => cat.parentid == parentid);
    }
  
    for (const cate of category) {
      categoryList.push({
        _id: cate._id,
        name: cate.name,
        slug: cate.slug,
        parentid :cate.parentid,
        children: filterCategories(categories, cate._id),
      });
    }
    return categoryList;
  }

exports.initialData = async (req,res) =>{
    const categories = await Category.find({})
    const products = await Product.find({}).select("_id name price description quantity productPictures slug category").populate({
      path:'category',
      select:"_id name"
    })

    res.status(200).json({
        categories:filterCategories(categories),
        products
    })
}