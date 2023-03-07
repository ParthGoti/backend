const Product = require("../model/product");
const shortid = require("shortid");
const { default: slugify } = require("slugify");

exports.addProduct = async (req, res) => {
  const { name, price, description, category, quantity } = req.body;

  let productPictures = [];

  if (req.files.length > 0) {
    productPictures = req.files.map((file) => {
      return {
        img: file.filename,
      };
    });
  }

  try {
    const productObj = {
      name,
      slug: slugify(name),
      price,
      quantity,
      description,
      productPictures,
      category,
      createdBy:req.user._id,
    };
    const _product = await Product.create(productObj);
    if (_product) {
    //   console.log(_product);
      return await res.status(200).json({
        message: "product created successfully!",
        data: _product,
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
