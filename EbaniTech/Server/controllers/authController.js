let authModel = require("../model/authModel");
let bcrypt = require("bcrypt");
let jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Invalid Cradantial" });
    }

    let salt = await bcrypt.genSalt(10);
    let hashPass = await bcrypt.hash(password, salt);
    console.log(hashPass);

    const user = await authModel.create({
      name,
      email,
      password: hashPass,
      role,
    });

    return res.status(201).json({ message: "User Created Sucessfullt", user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await authModel.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    let token = await jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
    );

    res.status(200).json({message :"Login Sucessfully",token,user:{id:user._id,name: user.name, email: user.email, role: user.role}})

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
