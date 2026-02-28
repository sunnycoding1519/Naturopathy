/* ===============================
   NATUROPATHY HEALING BACKEND
================================ */


const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const app = express();

app.use(cors());
app.use(express.json());

/* ===============================
   CONFIG
================================ */

const DATA_FILE = "data.json";
const ADMIN_FILE = "admins.json";
const SECRET = process.env.JWT_SECRET || "naturopathy_secret_key";

/* ===============================
   ENSURE DATA FILE EXISTS (RENDER FIX)
================================ */

if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ blogs: [], media: [] }));
}

/* ===============================
   CLOUDINARY CONFIG (FIXED)
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
  params: {
    folder: "naturopathy_media",
    resource_type: "auto"
  }
});

const upload = multer({ storage });

/* ===============================
   HELPERS
================================ */

function readData() {
  return JSON.parse(fs.readFileSync(DATA_FILE));
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function getAdmins() {
  return JSON.parse(fs.readFileSync(ADMIN_FILE));
}

/* ===============================
   AUTH MIDDLEWARE (FIXED SAFE)
================================ */

function verifyToken(req, res, next) {

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res.status(401).json({ message: "No token provided" });

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

app.get("/blogs", (req, res) => {
  res.json(readData().blogs);
});

app.post("/blogs", verifyToken, (req, res) => {

  const data = readData();

  const newBlog = {
    id: Date.now(),
    title: req.body.title,
    content: req.body.content
  };

  data.blogs.push(newBlog);
  saveData(data);

  res.json(newBlog);
});

app.delete("/blogs/:id", verifyToken, (req, res) => {

  const data = readData();

  data.blogs = data.blogs.filter(
    b => b.id != req.params.id
  );

  saveData(data);

  res.send("Blog deleted");
});

/* ===============================
   MEDIA ROUTES
================================ */

app.get("/media", (req, res) => {
  res.json(readData().media);
});

/* ===============================
   MEDIA UPLOAD (CLOUDINARY FIXED)
================================ */

app.post("/upload", verifyToken, upload.single("file"), (req, res) => {

  try {

    if (!req.file)
      return res.status(400).json({ message: "No file uploaded" });

    const data = readData();

    const type = req.file.mimetype.startsWith("video")
      ? "video"
      : "photo";

    const newMedia = {
      id: Date.now(),
      type,
      url: req.file.path   // Cloudinary URL
    };

    data.media.push(newMedia);
    saveData(data);

    res.json(newMedia);

  } catch (err) {
    console.log("UPLOAD ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ===============================
   DELETE MEDIA
================================ */

app.delete("/media/:id", verifyToken, (req, res) => {

  const data = readData();

  data.media = data.media.filter(
    m => m.id != req.params.id
  );

  saveData(data);

  res.send("Media deleted");
});

/* ===============================
   SERVER START
================================ */

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
});