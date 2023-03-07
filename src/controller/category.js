const Category = require("../model/category");
const slugify = require("slugify");

exports.addCategory = async (req, res) => {
  try {
    const categoryObj = {
      name: req.body.name,
      slug: slugify(req.body.name),
    };
    if (req.file) {
      categoryObj.categoryImage =
        process.env.API + "/public/" + req.file.filename;
    }
    if (req.body.parentid) {
      categoryObj.parentid = req.body.parentid;
    }
    const _category = await Category.create(categoryObj);
    if (_category) {
      console.log(_category);
      return await res.status(200).json({
        message: "category created successfully!",
        data: _category,
      });
    } else {
      return await res.status(400).json({
        message: "something went wrong!",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error!",
      error: error,
    });
  }
};

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
      children: filterCategories(categories, cate._id),
    });
  }
  return categoryList;
}

exports.getCategories = async (req, res) => {
  try {
    const _categories = await Category.find({});
    // console.log(_categories);
    if (_categories.length > 0) {
      const categoryList = filterCategories(_categories);
      return res.status(200).json({
        message: "Categories fetched successfully!",
        data: categoryList,
      });
    } else {
      return res.status(200).json({
        message: "Categories Not avialble",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "internal server error",
      error: error,
    });
  }
};
