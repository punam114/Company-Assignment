const User = require("../model/authModel");
const bcrypt = require("bcrypt");

// CREATE ADMIN
exports.createAdmin = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const hash = await bcrypt.hash(password, 10);

    const admin = await User.create({
      name,
      email,
      phone,
      password: hash,
      role: "admin"
    });

    res.status(201).json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL ADMINS
exports.getAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" });
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE ADMIN
exports.deleteAdmin = async (req, res) => {
  try {
    const admin = await User.findByIdAndDelete(req.params.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.status(200).json({ msg: "Admin deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE USER UNDER ANY ADMIN
exports.createUserUnderAdmin = async (req, res) => {
  try {
    const { name, email, password, phone, adminId } = req.body;
    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      password: hash,
      role: "user",
      createdBy: adminId
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL USERS (SUPER ADMIN POWER)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE ANY USER (SUPER ADMIN POWER)
exports.updateAnyUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    Object.assign(user, req.body);
    await user.save();

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE ANY USER (SUPER ADMIN POWER)
exports.deleteAnyUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ msg: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};