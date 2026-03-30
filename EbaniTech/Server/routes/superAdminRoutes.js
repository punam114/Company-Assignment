const express = require("express");
const { createAdmin, getAdmins, deleteAdmin, createUserUnderAdmin, getAllUsers, updateAnyUser, deleteAnyUser } = require("../controllers/superAdminController");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

const router = express.Router();

router.post("/admin", auth, role("super admin"), createAdmin);
router.get("/admins", auth, role("super admin"), getAdmins);
router.delete("/admin/:id", auth, role("super admin"), deleteAdmin);
router.post("/user", auth, role("super admin"), createUserUnderAdmin);

// NEW ENDPOINTS
router.get("/users", auth, role("super admin"), getAllUsers);
router.put("/user/:id", auth, role("super admin"), updateAnyUser);
router.delete("/user/:id", auth, role("super admin"), deleteAnyUser);

module.exports = router;
