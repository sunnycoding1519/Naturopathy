import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Fronted/components/Layout";

import Home from "./Fronted/pages/Home";
import Media from "./Fronted/pages/Media";
import Blog from "./Fronted/pages/Blog";
import Contact from "./Fronted/pages/Contact";
import Admin from "./Fronted/pages/Admin";
import Login from "./Fronted/pages/Login";
import ProtectedRoute from "./Fronted/components/ProtectedRoute";
import "./styles/global.css";

export default function App(){
  return(
    <BrowserRouter>
      <Layout>

        <Routes>

  <Route path="/" element={<Home/>}/>
  <Route path="/media" element={<Media/>}/>
  <Route path="/blog" element={<Blog/>}/>
  <Route path="/contact" element={<Contact/>}/>

  <Route path="/login" element={<Login/>}/>

  <Route
    path="/admin"
    element={
      <ProtectedRoute>
        <Admin/>
      </ProtectedRoute>
    }
  />

</Routes>
      </Layout>
    </BrowserRouter>
  );
}