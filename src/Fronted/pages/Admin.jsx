import "./Admin.css";
import { useState, useEffect } from "react";
import API from "../../api";

export default function Admin(){

  const [title,setTitle]=useState("");
  const [content,setContent]=useState("");
  const [file,setFile]=useState(null);
  const [preview,setPreview]=useState(null);
  const [progress,setProgress]=useState(0);
  const [message,setMessage]=useState("");

  const [blogs,setBlogs]=useState([]);
  const [media,setMedia]=useState([]);

  useEffect(()=>{
    fetchData();
  },[]);

  const fetchData=()=>{
    API.get("/blogs").then(res=>setBlogs(res.data));
    API.get("/media").then(res=>setMedia(res.data));
  };

  /* BLOG */
  const addBlog=()=>{
    API.post("/blogs",{title,content}).then(()=>{
      setTitle("");
      setContent("");
      setMessage("✅ Blog Added Successfully");
      fetchData();
    });
  };

  /* FILE SELECT */
  const handleFile=(e)=>{
    const selected=e.target.files[0];
    setFile(selected);

    if(selected){
      setPreview(URL.createObjectURL(selected));
    }
  };

  /* UPLOAD MEDIA */
  const uploadMedia=()=>{

    if(!file) return;

    const formData=new FormData();
    formData.append("file",file);

    API.post("/upload",formData,{
      headers:{
        "Content-Type":"multipart/form-data"
      },
      onUploadProgress:(data)=>{
        const percent=Math.round(
          (data.loaded*100)/data.total
        );
        setProgress(percent);
      }
    })
    .then(()=>{
      setMessage("🎉 Upload Successful!");
      setProgress(0);
      setPreview(null);
      setFile(null);
      fetchData();
    });
  };

  const deleteBlog=(id)=>{
    API.delete("/blogs/"+id).then(fetchData);
  };

  const deleteMedia=(id)=>{
    API.delete("/media/"+id).then(fetchData);
  };

  const logout=()=>{
    localStorage.removeItem("token");
    window.location="/login";
  };

  return(
    <div className="admin-container">

      <div className="admin-header">
        <h2>Admin Dashboard</h2>
        <button className="logout" onClick={logout}>Logout</button>
      </div>

      {message && <p className="success">{message}</p>}

      {/* BLOG SECTION */}
      <div className="admin-card">
        <h3>Add Blog</h3>

        <input
          placeholder="Blog Title"
          value={title}
          onChange={e=>setTitle(e.target.value)}
        />

        <textarea
          placeholder="Blog Content"
          value={content}
          onChange={e=>setContent(e.target.value)}
        />

        <button onClick={addBlog}>Publish Blog</button>
      </div>

      {/* UPLOAD SECTION */}
      <div className="admin-card">
        <h3>Upload Photo / Video</h3>

        <label className="upload-box">
          Choose File
          <input type="file" onChange={handleFile}/>
        </label>

        {/* PREVIEW */}
        {preview && (
          <div className="preview">
            {file.type.startsWith("video") ? (
              <video src={preview} controls/>
            ) : (
              <img src={preview} alt="preview"/>
            )}
          </div>
        )}

        {/* PROGRESS */}
        {progress>0 && (
          <div className="progress-bar">
            <div style={{width:`${progress}%`}}></div>
          </div>
        )}

        <button onClick={uploadMedia}>Upload</button>
      </div>

      {/* BLOG LIST */}
      <div className="admin-card">
        <h3>All Blogs</h3>
        {blogs.map(b=>(
          <div key={b.id} className="admin-item">
            {b.title}
            <button onClick={()=>deleteBlog(b.id)}>Delete</button>
          </div>
        ))}
      </div>

      {/* MEDIA LIST */}
      <div className="admin-card">
        <h3>All Media</h3>
        {media.map(m=>(
          <div key={m.id} className="admin-item">
            {m.type}
            <button onClick={()=>deleteMedia(m.id)}>Delete</button>
          </div>
        ))}
      </div>

    </div>
  );
}