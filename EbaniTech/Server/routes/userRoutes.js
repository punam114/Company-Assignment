const express = require("express");
const { createNote, getNotes, updateNote, deleteNote } = require("../controllers/userController");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

const router = express.Router();

router.post("/note", auth, role("user"), createNote);
router.get("/notes", auth, role("user"), getNotes);
router.put("/note/:id", auth, role("user"), updateNote);
router.delete("/note/:id", auth, role("user"), deleteNote);

module.exports = router;