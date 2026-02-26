import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <div className="app-wrapper">

      {/* NAVBAR */}
      <Navbar />

      {/* PAGE CONTENT */}
      <main className="page-wrapper">
        {children}
      </main>

      {/* FOOTER */}
      <Footer />

    </div>
  );
}