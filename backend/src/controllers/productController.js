const Product = require('../models/Product');

/**
 * Lấy danh sách tất cả sản phẩm với tùy chọn tìm kiếm, lọc và phân trang.
 * @param {*} req
 * @param {*} res
 * -
 * - Chọn trang: Sử dụng query parameter `page`. Ví dụ: /api/products?page=2
 * - Chọn số lượng sản phẩm trên mỗi trang: Sử dụng query parameter `limit`. Ví dụ: /api/products?limit=5
 * - Bạn cũng có thể kết hợp phân trang với tìm kiếm và lọc:
 *   /api/products?search=iPhone&priceMin=500&priceMax=1000&page=2&limit=5
 */
exports.getProducts = async (req, res) => {
  const { search, priceMin, priceMax, page = 1, limit = 10 } = req.query;
  let query = {};

  if (search) {
    query.name = new RegExp(search, 'i'); // Tìm kiếm không phân biệt hoa/thường
  }

  if (priceMin || priceMax) {
    query.price = {};
    if (priceMin) query.price.$gte = Number(priceMin);
    if (priceMax) query.price.$lte = Number(priceMax);
  }

  const skip = (Number(page) - 1) * Number(limit);

  try {
    const products = await Product.find(query).skip(skip).limit(Number(limit));
    const total = await Product.countDocuments(query);
    res.json({
      products,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy chi tiết một sản phẩm cụ thể theo ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Thêm sản phẩm mới
exports.createProduct = async (req, res) => {
  const { name, description, price, imageUrl, stock } = req.body;
  console.log(name, description, price, imageUrl, stock);
  try {
    const newProduct = new Product({
      name,
      description,
      price,
      imageUrl,
      stock,
    });

    const savedProduct = await newProduct.save();
    res.json(savedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cập nhật thông tin sản phẩm
exports.updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Xóa sản phẩm
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
