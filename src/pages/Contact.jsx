import "./Contact.css";
import { useState } from "react";
import axios from "axios";

export default function Contact(){

  const [name,setName]=useState("");
  const [phone,setPhone]=useState("");
  const [message,setMessage]=useState("");
  const [loading,setLoading]=useState(false);

  /* ⭐⭐⭐ ADD YOUR GOOGLE APPS SCRIPT URL HERE ⭐⭐⭐ */
  const SHEET_API_URL = "PASTE_YOUR_APPSCRIPT_WEBAPP_URL_HERE";
  // Example:
  // const SHEET_API_URL = "https://script.google.com/macros/s/AKfycbxxxxxxx/exec";


  const submitForm = async () => {

    if(!name || !phone){
      alert("Please fill Name & Phone");
      return;
    }

    setLoading(true);

    try{

      await axios.post(SHEET_API_URL,{
        name:name,
        phone:phone,
        message:message
      });

      alert("✅ Message Sent Successfully");

      setName("");
      setPhone("");
      setMessage("");

    }catch(error){
      console.log(error);
      alert("❌ Failed to send message");
    }

    setLoading(false);
  };

  return(
    <div className="contact-container">

      <h2>Contact Us</h2>

      <p className="subtitle">
        Have questions about naturopathy healing? Send us your query.
      </p>

      <div className="contact-card">

        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e)=>setName(e.target.value)}
        />

        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e)=>setPhone(e.target.value)}
        />

        <textarea
          placeholder="Your Message"
          value={message}
          onChange={(e)=>setMessage(e.target.value)}
        />

        <button onClick={submitForm}>
          {loading ? "Sending..." : "Submit Message"}
        </button>

      </div>

      {/* DIRECT CONTACT SECTION */}
      <div className="contact-info">

        <h3>Direct Contact</h3>

        <a href="tel:+917355095660" className="call-btn">
          📞 Call Now
        </a>

        <a
          href="https://wa.me/919250588545"
          target="_blank"
          rel="noreferrer"
          className="whatsapp-btn"
        >
          💬 WhatsApp Chat
        </a>

      </div>

    </div>
  );
}