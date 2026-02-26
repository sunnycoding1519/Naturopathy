import "./Blog.css";
import {useEffect,useState} from "react";
import axios from "axios";

export default function Blog(){

 const [blogs,setBlogs]=useState([]);

 useEffect(()=>{
   axios.get("http://localhost:5000/blogs")
   .then(res=>setBlogs(res.data));
 },[]);

 return(
  <div className="container blog">
    <h1>Healing Blogs</h1>

    {blogs.map((b,i)=>(
      <div className="blog-card" key={i}>
        <h2>{b.title}</h2>
        <p>{b.content}</p>
      </div>
    ))}
  </div>
 )
}