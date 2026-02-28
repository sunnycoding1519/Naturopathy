/* ===============================
   NATUROPATHY HEALING BACKEND
================================ */

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const fs = require("fs");

const Blog = require("./models/Blog");
const Media = require("./models/Media");

const app = express();

app.use(cors());
app.use(express.json());

/* ===============================
   ENV CHECK (VERY IMPORTANT)
================================ */

if (!process.env.MONGO_URI) {
  console.log("❌ MONGO_URI missing");
}

if (!process.env.JWT_SECRET) {
  console.log("❌ JWT_SECRET missing");
}
/* ===============================
   MONGODB CONNECT (FIXED)
================================ */

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("✅ MongoDB Connected Successfully");
})
.catch(err => {
  console.error("❌ MongoDB Connection Error:", err.message);
  process.exit(1); // server crash if DB fail
});

/* ===============================
   CONFIG
================================ */

const ADMIN_FILE = "admins.json";
const SECRET = process.env.JWT_SECRET || "naturopathy_secret_key";

/* ===============================
   CLOUDINARY CONFIG
================================ */

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/* ===============================
   CLOUDINARY STORAGE
================================ */

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "naturopathy_media",
    resource_type: "auto"
  })
});

const upload = multer({ storage });

/* ===============================
   HELPERS
================================ */

function getAdmins() {
  return JSON.parse(fs.readFileSync(ADMIN_FILE));
}

/* ===============================
   AUTH MIDDLEWARE
================================ */

function verifyToken(req, res, next) {

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res.status(401).json({ message: "No token" });

  const token = authHeader.split(" ")[1];

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid token" });
    req.user = decoded;
    next();
  });
}

/* ===============================
   LOGIN
================================ */

app.post("/login", (req, res) => {

  const { username, password } = req.body;

  const admins = getAdmins();

  const user = admins.find(
    u => u.username === username && u.password === password
  );

  if (!user)
    return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ username }, SECRET, { expiresIn: "1d" });

  res.json({ token });
});

/* ===============================
   BLOG ROUTES
================================ */

app.get("/blogs", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: "Blog fetch error" });
  }
});

app.post("/blogs", verifyToken, async (req, res) => {
  try {
    const blog = await Blog.create({
      title: req.body.title,
      content: req.body.content
    });

    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: "Blog create failed" });
  }
});

app.delete("/blogs/:id", verifyToken, async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.send("Blog deleted");
  } catch {
    res.status(500).json({ message: "Delete failed" });
  }
});

/* ===============================
   MEDIA ROUTES
================================ */

app.get("/media", async (req, res) => {
  try {
    const media = await Media.find().sort({ createdAt: -1 });
    res.json(media);
  } catch {
    res.status(500).json({ message: "Media fetch error" });
  }
});

app.post("/upload", verifyToken, upload.single("file"), async (req, res) => {

  try {

    if (!req.file)
      return res.status(400).json({ message: "No file uploaded" });

    const type = req.file.mimetype.startsWith("video")
      ? "video"
      : "photo";

    const media = await Media.create({
      type,
      url: req.file.path
    });

    res.json(media);

  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ message: "Upload failed" });
  }
});

app.delete("/media/:id", verifyToken, async (req, res) => {
  try {
    await Media.findByIdAndDelete(req.params.id);
    res.send("Media deleted");
  } catch {
    res.status(500).json({ message: "Delete failed" });
  }
});

/* ===============================
   SERVER START
================================ */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on ${PORT}`);
});