import "./Media.css";
import { useEffect, useState } from "react";
import API from "../api";

export default function Media() {

  const [media, setMedia] = useState([]);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try{
      const res = await API.get("/media");
      setMedia(res.data);
    }catch(err){
      console.log("Media fetch error:", err);
    }
  };

  return (
    <div className="container media-page">

      <h1 className="media-title">Media Gallery</h1>

      <div className="media-grid">

        {media.map((item) => (
          <div key={item._id} className="media-card">

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