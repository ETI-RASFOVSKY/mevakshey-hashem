const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { adminOnly } = require("../middlewares/authMiddleware");

// כל הנתיבים דורשים הרשאות admin
router.get("/", adminOnly, userController.getAllUsers);
router.post("/", adminOnly, userController.addUser);
router.delete("/:id", adminOnly, userController.deleteUser);
router.put("/:id", adminOnly, userController.updateUser);

module.exports = router;
