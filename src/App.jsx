import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

import Home from "./pages/Home";
import Media from "./pages/Media";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
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