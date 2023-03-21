const Product = require("../model/product");
const shortid = require("shortid");
const { default: slugify } = require("slugify");
const Category = require("../model/category");

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
      createdBy: req.user._id,
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

exports.getProductBySlug = async (req, res) => {
  const { slug } = req.params;
  try {
    const category = await Category.findOne({ slug: slug }).select("_id type");
    // console.log(result);
    if (category) {
      const products = await Product.find({ category: category._id });
      // console.log(products);
      if (category.type) {
        if (products.length > 0) {
          res.status(200).json({
            products,
            productsByPrice: {
              under5k: products.filter((product) => product.price <= 5000),
              under10k: products.filter(
                (product) => product.price > 5000 && product.price <= 10000
              ),
              under15k: products.filter(
                (product) => product.price > 10000 && product.price <= 15000
              ),
              under20k: products.filter(
                (product) => product.price > 15000 && product.price <= 20000
              ),
              under30k: products.filter(
                (product) => product.price > 20000 && product.price <= 30000
              ),
            },
          });
        } else {
          return res.status(400).json({
            message: "No Product Avialable",
          });
        }
      } else {
        return res.status(200).json({
          products,
        });
      }
    } else {
      return res.status(400).json({
        message: "Something Went Wrong!",
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

exports.getProductDetailsById = async (req, res) => {
  const { productId } = req.params;
  console.log(productId);
  if (productId) {
    const product = await Product.findOne({ _id: productId });
    if (product) {
      return res.status(200).json({
        product,
      });
    } else {
      return res.status(400).json({
        product,
        error: "something Went wrong",
      });
    }
  } else {
    return res.status(400).json({
      error: "Params Required",
    });
  }
};

exports.deleteProductById = async (req, res) => {
  const { productId } = req.body.payload;
  if (productId) {
    try {
      const result = await Product.deleteOne({ _id: productId });
      if (result) {
        res.status(200).json({ result });
      }
    } catch (error) {
      res.status(400).json({ error });
    }
  } else {
    res.status(400).json({ error: "Params required" });
  }
};


exports.getProducts = async (req, res) => {
  const products = await Product.find({ createdBy: req.user._id })
    .select("_id name price quantity slug description productPictures category")
    .populate({ path: "category", select: "_id name" })
    .exec();

  res.status(200).json({ products });
};

