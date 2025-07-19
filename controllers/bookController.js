const Book = require("../model/Book");        // ✅ Ensure folder is 'models'
const Review = require("../model/Review");    // ✅ Correct path

// ================= CREATE BOOK =================
exports.createBook = async (req, res) => {
  const { title, author, condition, imageURL } = req.body;

  if (!title || !author || !condition || !imageURL) {
    return res.status(400).json({
      error:
        "Please provide all required fields: title, author, condition, imageURL",
    });
  }

  try {
    const book = await Book.create({
      title,
      author,
      condition,
      imageURL,
      user: req.user.id,
    });

    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= GET ALL BOOKS (with search) =================
exports.getBooks = async (req, res) => {
  try {
    const { search } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search.trim(), $options: "i" } },
        { author: { $regex: search.trim(), $options: "i" } },
      ];
    }

    const books = await Book.find(query).populate("user", "name");

    res.status(200).json(books);
  } catch (err) {
    console.error("Error fetching books:", err);
    res.status(500).json({ error: "Server error. Could not fetch books." });
  }
};

// ================= GET MY BOOKS =================
exports.getMyBooks = async (req, res) => {
  try {
    const books = await Book.find({ user: req.user.id });
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= DELETE BOOK =================
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.json({ message: "Book deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= LIKE A BOOK =================
exports.likeBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      {
        $inc: { like: 1 },
      },
      { new: true }
    );

    if (!book) return res.status(404).send({ error: "Book not found" });

    res.status(200).send(book);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error. Could not like the book" });
  }
};

// ================= ADD A REVIEW =================
exports.addReview = async (req, res) => {
  const { rating } = req.body;
  const bookId = req.params.id;

  try {
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).send({ error: "Book not found" });
    }

    const review = new Review({
      book: bookId,
      user: req.user.id, // ✅ Use authenticated user
      rating,
    });

    await review.save();

    res.status(200).send({ message: "Review added successfully" });
  } catch (error) {
    console.error("Add Review Error:", error);
    res.status(500).send({ error: "Could not add review" });
  }
};
