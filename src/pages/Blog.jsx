import "./Blog.css";
import { useEffect, useState } from "react";
import API from "../api";

export default function Blog() {

  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try{
      const res = await API.get("/blogs");
      setBlogs(res.data);
    }catch(err){
      console.log("Blog fetch error:", err);
    }
  };

  return (
    <div className="container blog">
      <h1>Healing Blogs</h1>

      {blogs.map((b) => (
        <div className="blog-card" key={b._id}>
          <h2>{b.title}</h2>
          <p>{b.content}</p>
        </div>
      ))}
    </div>
  );
}