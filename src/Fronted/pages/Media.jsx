import "./Media.css";
import { useEffect, useState } from "react";
import API from "../../api";

export default function Media(){

  const [media,setMedia]=useState([]);

  useEffect(()=>{
    API.get("/media").then(res=>setMedia(res.data));
  },[]);

  return(
    <div className="container media-page">

      <h1 className="media-title">Media Gallery</h1>

      <div className="media-grid">

        {media.map(item=>(
          <div key={item.id} className="media-card">

            {item.type === "photo" ? (
              <img src={item.url} alt="media"/>
            ) : (
              <video controls>
                <source src={item.url}/>
              </video>
            )}

          </div>
        ))}

      </div>

    </div>
  );
}