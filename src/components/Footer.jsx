import "./Footer.css";

export default function Footer(){

  return(
    <footer className="footer">

      <div className="footer-content">

        {/* LEFT */}
        <div className="footer-left">
          <h3>🌿 Naturopathy Healing</h3>
          <p>Natural Healing • Healthy Living</p>
        </div>

        {/* HELPLINE */}
        <div className="footer-contact">
          <p>📞 Helpline: +91 7355095660</p>
          <p>📞 Helpline: +91 9250588545</p>
          <p>💬 WhatsApp: +91 9250588545</p>
        </div>

        {/* SOCIAL ICONS */}
        <div className="footer-social">

              <p>Follow us on social media</p>

          {/* Instagram */}
          <a href="#" target="_blank" rel="noreferrer">
            <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="instagram"/>
          </a>

          {/* Facebook */}
          <a href="#" target="_blank" rel="noreferrer">
            <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="facebook"/>
          </a>

          {/* YouTube */}
          <a href="#" target="_blank" rel="noreferrer">
            <img src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png" alt="youtube"/>
          </a>

          {/* WhatsApp */}
          <a href="#" target="_blank" rel="noreferrer">
            <img src="https://cdn-icons-png.flaticon.com/512/733/733585.png" alt="whatsapp"/>
          </a>

        </div>

      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Naturopathy Healing
      </div>

    </footer>
  );
}