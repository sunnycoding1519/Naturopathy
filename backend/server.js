/* ===============================
   NATUROPATHY HEALING BACKEND
================================ */

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

/* ===============================
   CONFIG
================================ */

const DATA_FILE = "data.json";
const ADMIN_FILE = "admins.json";
const SECRET = "naturopathy_secret_key";

/* ===== READ ADMIN USERS ===== */

function getAdmins() {
  return JSON.parse(fs.readFileSync("admins.json"));
}

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
   AUTH MIDDLEWARE
================================ */

function verifyToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid token" });

    req.user = decoded;
    next();
  });
}

/* ===============================
   FILE UPLOAD SETUP
================================ */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

/* ===============================
   LOGIN (OWNER CONTROLLED)
================================ */

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const admins = getAdmins();

  const user = admins.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { username },
    SECRET,
    { expiresIn: "4h" }
  );

  res.json({ token });
});

/* ===============================
   LOGIN ROUTE
================================ */

app.post("/login", (req, res) => {

  const { username, password } = req.body;

  const admins = getAdmins();

  const user = admins.find(
    u => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { username },
    SECRET,
    { expiresIn: "4h" }
  );

  res.json({ token });
});

/* ===============================
   BLOG ROUTES
================================ */

// public get blogs
app.get("/blogs", (req, res) => {
  res.json(readData().blogs);
});

// add blog (protected)
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

// delete blog
app.delete("/blogs/:id", verifyToken, (req, res) => {
  const data = readData();

  data.blogs = data.blogs.filter(
    (b) => b.id != req.params.id
  );

  saveData(data);

  res.send("Blog deleted");
});

/* ===============================
   MEDIA ROUTES
================================ */

// public get media
app.get("/media", (req, res) => {
  res.json(readData().media);
});

/* ===============================
   MEDIA UPLOAD (FIXED)
================================ */

app.post("/upload", verifyToken, (req, res) => {

  upload.single("file")(req, res, function (err) {

    if (err) {
      console.log("Upload error:", err);
      return res.status(500).json({ message: "Upload failed" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    try {

      const data = readData();

      const type = req.file.mimetype.startsWith("video")
        ? "video"
        : "photo";

      const newMedia = {
        id: Date.now(),
        type,
        url: `http://localhost:5000/uploads/${req.file.filename}`
      };

      data.media.push(newMedia);
      saveData(data);

      res.json(newMedia);

    } catch (e) {
      console.log("Server crash:", e);
      res.status(500).json({ message: "Server error" });
    }

  });

});
// delete media
app.delete("/media/:id", verifyToken, (req, res) => {
  const data = readData();

  data.media = data.media.filter(
    (m) => m.id != req.params.id
  );

  saveData(data);

  res.send("Media deleted");
});

/* ===============================
   SERVER START
================================ */

app.listen(5000, () =>
  console.log("✅ Server running at http://localhost:5000")
);