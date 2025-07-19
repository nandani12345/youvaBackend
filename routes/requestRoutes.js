const express = require("express");
const router = express.Router();

const {
  sendRequest,
  getIncomingRequests,
  getSentRequests,
  updateRequestStatus,
} = require("../controllers/requestController");

// Send a book request
router.post("/", sendRequest);

// Get incoming requests (requests for your books)
router.get("/incoming", getIncomingRequests);

// Get sent requests
router.get("/sent", getSentRequests);

// Update request status (accept/decline)
router.put("/:id", updateRequestStatus);

module.exports = router;