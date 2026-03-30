const User = require("../model/authModel");
const bcrypt = require("bcrypt");

// CREATE USER
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      password: hash,
      role: "user",
      createdBy: req.user.id
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET MY USERS ONLY
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ createdBy: req.user.id });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE USER (OWN ONLY)
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
      createdBy: req.user.id
    });

    if (!user) return res.status(403).json({ msg: "Not allowed" });

    Object.assign(user, req.body);
    await user.save();

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE USER (OWN ONLY)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id
    });

    if (!user) return res.status(403).json({ msg: "Not allowed" });

    res.status(200).json({ msg: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};