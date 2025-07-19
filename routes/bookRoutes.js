// routes/bookRoutes.js
const express = require("express");
const router = express.Router();

// Import controller functions
const {
  createBook,
  getBooks,
  getMyBooks,
  deleteBook,
  addReview,
  likeBook,
} = require("../controllers/bookController");

// Import auth middleware
const auth = require("../middleware/authMiddleware"); // <-- Import here

// Routes with middleware
router.post("/create", auth, createBook); // Protected
router.get("/", getBooks); // Public or protected, depending on use case
router.get("/mybooks", auth, getMyBooks); // Protected
router.delete("/:id", auth, deleteBook); // Protected

router.post("/:id/review", auth, addReview);
router.post("/:id/like", auth, likeBook); // ✅ Correct

module.exports = router;
