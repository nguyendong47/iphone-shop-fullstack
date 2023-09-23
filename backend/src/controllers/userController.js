const User = require('../models/User');

exports.createUser = async (req, res) => {
  // Nhận thông tin người dùng từ req.body
  const { username, email, password } = req.body;

  try {
    // Tạo mới người dùng
    const user = new User({ username, email, password });
    await user.save();

    res.status(201).json({
      message: 'Người dùng đã được tạo mới thành công.',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Đã xảy ra lỗi trong quá trình tạo mới người dùng.',
    });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Đã xảy ra lỗi trong quá trình lấy danh sách người dùng.',
    });
  }
};

exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Đã xảy ra lỗi trong quá trình lấy thông tin người dùng.',
    });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { username, email },
      { new: true },
    );
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
    }
    res.json({
      message: 'Thông tin người dùng đã được cập nhật thành công.',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Đã xảy ra lỗi trong quá trình cập nhật thông tin người dùng.',
    });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndRemove(id);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
    }
    res.json({ message: 'Người dùng đã được xóa thành công.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Đã xảy ra lỗi trong quá trình xóa người dùng.',
    });
  }
};
