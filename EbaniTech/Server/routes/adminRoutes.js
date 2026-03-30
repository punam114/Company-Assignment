const express = require("express");
const { createUser, getUsers, updateUser, deleteUser } = require("../controllers/adminController");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

const router = express.Router();

router.post("/user", auth, role("admin"), createUser);
router.get("/users", auth, role("admin"), getUsers);
router.put("/user/:id", auth, role("admin"), updateUser);
router.delete("/user/:id", auth, role("admin"), deleteUser);

module.exports = router;