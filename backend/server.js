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
   MONGODB CONNECT
================================ */

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("✅ MongoDB Connected"))
.catch(err=>console.log(err));

/* ===============================
   CONFIG
================================ */

const ADMIN_FILE = "admins.json";
const SECRET = process.env.JWT_SECRET;

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
  params: {
    folder: "naturopathy_media",
    resource_type: "auto"
  }
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

function verifyToken(req,res,next){

  const authHeader = req.headers.authorization;

  if(!authHeader || !authHeader.startsWith("Bearer "))
    return res.status(401).json({message:"No token"});

  const token = authHeader.split(" ")[1];

  jwt.verify(token, SECRET,(err,decoded)=>{
    if(err) return res.status(401).json({message:"Invalid token"});
    req.user = decoded;
    next();
  });
}

/* ===============================
   LOGIN
================================ */

app.post("/login",(req,res)=>{

  const {username,password} = req.body;

  const admins = getAdmins();

  const user = admins.find(
    u=>u.username===username && u.password===password
  );

  if(!user)
    return res.status(401).json({message:"Invalid credentials"});

  const token = jwt.sign({username},SECRET,{expiresIn:"1d"});

  res.json({token});
});

/* ===============================
   BLOG ROUTES (MONGODB)
================================ */

app.get("/blogs", async(req,res)=>{
  const blogs = await Blog.find().sort({createdAt:-1});
  res.json(blogs);
});

app.post("/blogs", verifyToken, async(req,res)=>{

  const blog = new Blog({
    title:req.body.title,
    content:req.body.content
  });

  await blog.save();
  res.json(blog);
});

app.delete("/blogs/:id", verifyToken, async(req,res)=>{

  await Blog.findByIdAndDelete(req.params.id);
  res.send("Blog deleted");
});

/* ===============================
   MEDIA ROUTES (MONGODB + CLOUDINARY)
================================ */

app.get("/media", async(req,res)=>{
  const media = await Media.find().sort({createdAt:-1});
  res.json(media);
});

app.post("/upload", verifyToken, upload.single("file"), async(req,res)=>{

  try{

    if(!req.file)
      return res.status(400).json({message:"No file uploaded"});

    const type = req.file.mimetype.startsWith("video")
      ? "video"
      : "photo";

    const media = new Media({
      type,
      url:req.file.path
    });

    await media.save();

    res.json(media);

  }catch(err){
    console.log(err);
    res.status(500).json({message:"Upload failed"});
  }
});

app.delete("/media/:id", verifyToken, async(req,res)=>{

  await Media.findByIdAndDelete(req.params.id);
  res.send("Media deleted");
});

/* ===============================
   SERVER START
================================ */

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
  console.log(`🚀 Server running on ${PORT}`);
});