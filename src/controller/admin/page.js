const Page = require("../../model/page");

exports.createPage = async (req, res) => {
  const { banners, products } = req.files;
  if (banners && banners.length > 0) {
    req.body.banners = banners.map((banner, index) => ({
      img: `${process.env.API}/public/${banner.filename}`,
      navigateTo: `bannerClicked?categoryId=${req.body.category}&type=${req.body.type}`,
    }));
  }
  if (products && products.length > 0) {
    req.body.products = products.map((product, index) => ({
      img: `${process.env.API}/public/${product.filename}`,
      navigateTo: `productClicked?categoryId=${req.body.category}&type=${req.body.type}`,
    }));
  }
  req.body.createdBy = req.user._id;

  const page = await Page.findOne({ category: req.body.category });
  if (page) {
    const updatedpage = await Page.findOneAndUpdate(
      { category: req.body.category },
      req.body
    );
    if (updatedpage) {
      return res.status(201).json({ pageData: updatedpage });
    }
  } else {
    const pageData = await Page.create(req.body);

    if (pageData) {
      return res.status(200).json({
        pageData,
      });
    } else {
      return res.status(400).json({
        messgae: "something went wrong",
      });
    }
  }
};

exports.getPage = async (req, res) => {
  const { category, type } = req.params;
  console.log("{ category, type }", { category, type });
  if (type === "page") {
    const pageData = await Page.findOne({ category: category });
    if (pageData) {
      return res.status(200).json({ pageData });
    } else {
      return res.status(400).json({
        messgae: "something went wrong!",
      });
    }
  }
};
