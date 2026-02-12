const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const ctrl = require("../controllers/candidate.controllers");

router.post("/", auth, upload.single("resume"), ctrl.create);
router.get("/", auth, ctrl.getAll);
router.put("/:id/status", auth, ctrl.updateStatus);
router.delete("/:id", auth, ctrl.remove);

module.exports = router;