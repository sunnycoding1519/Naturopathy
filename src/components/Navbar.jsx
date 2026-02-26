import "./Navbar.css";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar() {

  const [open,setOpen]=useState(false);
  const [scrolled,setScrolled]=useState(false);
  const location = useLocation();

  /* Scroll Blur Effect */
  useEffect(()=>{
    const handleScroll=()=>{
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll",handleScroll);
    return ()=>window.removeEventListener("scroll",handleScroll);
  },[]);

  return (
    <nav className={scrolled ? "navbar scrolled" : "navbar"}>

      <div className="nav-inner">

        <h2 className="logo">🌿 Naturopathy Healing</h2>

        {/* Hamburger */}
        <div
          className={open ? "menu-icon active" : "menu-icon"}
          onClick={()=>setOpen(!open)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Links */}
        <div className={open ? "nav-links active" : "nav-links"}>

          <Link className={location.pathname==="/"?"active":""} to="/">Home</Link>
          <Link className={location.pathname==="/media"?"active":""} to="/media">Media</Link>
          <Link className={location.pathname==="/blog"?"active":""} to="/blog">Blog</Link>
          <Link className={location.pathname==="/contact"?"active":""} to="/contact">Contact</Link>
          <Link className={location.pathname==="/admin"?"active":""} to="/admin">Admin</Link>

        </div>

      </div>
    </nav>
  );
}