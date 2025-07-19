const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Import Routes
const userRoutes = require("./routes/userRoutes");     // Auth, signup, login
const bookRoutes = require("./routes/bookRoutes");     // Book CRUD

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());
// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON bodies

// Routes Middleware
app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    // serverSelectionTimeoutMS: 5000,
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error(" MongoDB connection error:", err));

// Basic Health Check Route (Optional)
app.get("/", (req, res) => {
  res.json({ message: "Welcome to BookSwap API", status: "Running" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});