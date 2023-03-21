const Category = require("../model/category");
const slugify = require("slugify");
const shortid = require("shortid");

exports.addCategory = async (req, res) => {
  try {
    const categoryObj = {
      name: req.body.name,
      slug: `${slugify(req.body.name)}-${shortid.generate()}`,
    };
    if (req.file) {
      categoryObj.categoryImage =
        "/public/" + req.file.filename;
    }
    if (req.body.parentid) {
      categoryObj.parentid = req.body.parentid;
    }
    const _category = await Category.create(categoryObj);
    if (_category) {
      console.log(_category);
      return await res.status(200).json({
        message: "category created successfully!",
        _category,
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
      parentid: cate.parentid,
      type: cate.type,
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
        categoryList,
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

exports.updateCategory = async (req, res) => {
  const { _id, name, parentid, type } = req.body;
  const updatedCategories = [];
  if (name instanceof Array) {
    for (let i = 0; i < name.length; i++) {
      const category = {
        name: name[i],
        type: type[i],
      };
      if (parentid[i] !== "") {
        category.parentid = parentid[i];
      }
      const updatedCategory = await Category.findOneAndUpdate(
        { _id: _id[i] },
        category,
        { new: true }
      );
      console.log(updatedCategory);
      updatedCategories.push(updatedCategory);
    }
    return res.status(200).json({
      updatedCategories,
    });
  } else {
    const category = {
      name,
      type,
    };
    if (parentid !== "") {
      category.parentid = parentid;
    }
    const updatedCategory = await Category.findOneAndUpdate({ _id }, category, {
      new: true,
    });
    return res.status(200).json({
      updatedCategory,
    });
  }
};

exports.deleteCategory = async (req, res) => {
  const { ids } = req.body.payload;
  const deletedCategories = [];
  for (let i = 0; i < ids.length; i++) {
    const deleteCategory = await Category.findOneAndDelete({ _id: ids[i]._id });
    deletedCategories.push(deleteCategory);
  }
  if (deletedCategories.length == ids.length) {
    return res.status(200).json({
      message: "Categories removed",
    });
  } else {
    return res.status(400).json({
      message: "Something Went Wrong",
    });
  }
};
