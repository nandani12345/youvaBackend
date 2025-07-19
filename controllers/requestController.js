// controllers/requestController.js
const Book = require("../model/Book");
const Request = require("../model/Request");

// ✅ Send book request
exports.sendRequest = async (req, res) => {
  try {
    const { bookId } = req.body;

    const book = await Book.findById(bookId);
    if (!book || book.user.toString() === req.user.id) {
      return res.status(400).json({ msg: "Invalid request" });
    }

    const already = await Request.findOne({ bookId, requesterId: req.user.id });
    if (already) {
      return res.status(400).json({ msg: "Already requested this book" });
    }

    const request = new Request({ bookId, requesterId: req.user.id });
    await request.save();

    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ msg: "Request failed", error: err.message });
  }
};

// ✅ Get incoming requests (requests for user's books)
exports.getIncomingRequests = async (req, res) => {
  try {
    const books = await Book.find({ user: req.user.id });
    const bookIds = books.map((book) => book._id);

    const requests = await Request.find({ bookId: { $in: bookIds } })
      .populate("bookId")
      .populate("requesterId", "name email");

    res.json(requests);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch incoming requests" });
  }
};

// ✅ Get sent requests
exports.getSentRequests = async (req, res) => {
  try {
    const requests = await Request.find({ requesterId: req.user.id }).populate(
      "bookId"
    );
    res.json(requests);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch sent requests" });
  }
};

// ✅ Update request status (accept/decline)
exports.updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const request = await Request.findById(req.params.id).populate("bookId");

    if (!request) {
      return res.status(404).json({ msg: "Request not found" });
    }

    if (request.bookId.user.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    request.status = status;
    await request.save();

    res.json(request);
  } catch (err) {
    res.status(500).json({ msg: "Failed to update request status" });
  }
};