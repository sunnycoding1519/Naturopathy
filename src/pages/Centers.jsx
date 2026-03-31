import { useState } from "react";
import "./Centers.css";

const centers = [
  {
    id: 1,
    city: "Lucknow",
    name: "Shashwat Chikitsa – Lucknow",
    address:
      "1/639,sec-J,Janki Mor, Near Gudmba Police Station,Jankipuram,Lucknow – 226026",
    phone: "+91 73550 95660",
    timing: "Mon – Sat : 8:00 AM – 4:00 PM",
    image: "/images/centers/center UP.jpeg",
    map: "https://www.google.com/maps?q=Lucknow&output=embed",
    scripturl: "YOUR_SCRIPT_URL"
  },
  {
    id: 2,
    city: "Ajmer",
    name: "Shashwat Wellness Centre – Ajmer",
    address: "Krishnpura, Ajmer Rajasthan",
    phone: "+91 8619452121",
    timing: "Sunday Only",
    image: "/images/centers/Ajmer.jpeg",
    map: "https://www.google.com/maps?q=Ajmer&output=embed",
    scripturl: "YOUR_SCRIPT_URL"
  },
  {
    id: 3,
    city: "Kanpur",
    name: "Panchvidhi Shashwat Chikitsa Kendra – Kanpur",
    address:
      "M.I.G-8,Barra-6,Kanpur Nagar(UP)– 208027",
    phone: "Dr.Anoop Kushwaha (+91 9559906407)",
    timing: "Mon – Sat : 8:00 AM – 4:00 PM",
    image: "/images/centers/Kanpur.jpeg",
    /*map:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5975.778133642752!2d80.94156777770996!3d26.913884999999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399957c2c3d0fd13%3A0x871ab3b0fedf760!2sJankipuram%2C%20Lucknow!5e1!3m2!1sen!2sin!4v1767985897468!5m2!1sen!2sin",
    scripturl:
      "https://script.google.com/macros/s/AKfycbxaI8p4I87OKFh9eEsr9lPkqAQTlIqBNTlwdnL3n0B1gx_492vTKswJdvR2i1s288O5/exec"*/
  },
  {
    id: 4,
    city: "Ghaziabad",
    name: "Shashwat Chikitsa Kendra – Ghaziabad",
    address: "42-g,Nyay Khand-3,Indirapuram,Ghaziabad(UP)– 201014",
    phone: "Dr.Swami Bhakti Parkash(+91 9711147989/+91 9312158400)",
    timing: "Mon – Sat : 8:00 AM – 4:00 PM",
    image: "/images/centers/Ghaziabad.jpeg",
    /*map:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5975.778133642752!2d80.94156777770996!3d26.913884999999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399957c2c3d0fd13%3A0x871ab3b0fedf760!2sJankipuram%2C%20Lucknow!5e1*/
  },
  {
    id: 5,
    city: "Nagpur",
    name: "Shashwat Chikitsa Kendra – Nagpur",
    address: "Basement Shop no.3,Amar jyoti complex, Near Metro scan Pathology lab, Wardha Road,Dhantoli, Nagpur-440012",
    phone: "(+91 9607395252/+91 7709856858)",
    timing: "Mon – Sat : 8:00 AM – 4:00 PM",
    image: "/images/centers/nagpur.jpeg",
    /*map:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5975.778133642752!2d80.94156777770996!3d26.913884999999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399957c2c3d0fd13%3A0x871ab3b0fedf760!2sJankipuram%2C%20Lucknow!5e1*/
  }
];

export default function Centers() {

  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e, center) => {
    e.preventDefault();

    fetch(center.scripturl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams(formData)
    })
      .then(() => {
        alert(`Enquiry sent for ${center.name}`);
        setFormData({ name: "", phone: "", message: "" });
      })
      .catch(() => alert("Error"));
  };

  // 🔍 FILTER LOGIC
  const filteredCenters = centers.filter((c) =>
    c.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="centers-page">

      <h2 className="centers-title">Our Healing Centers</h2>
      <p className="centers-subtitle">
        Find your nearest naturopathy center
      </p>

      {/* 🔍 SEARCH BOX */}
      <div className="center-filter">
        <input
          type="text"
          placeholder="Search city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
        >
          <option value="">All Cities</option>
          {centers.map((c) => (
            <option key={c.id} value={c.city}>
              {c.city}
            </option>
          ))}
        </select>
      </div>

      <div className="centers-grid">
        {filteredCenters
          .filter(c => !selectedCity || c.city === selectedCity)
          .map((center) => (
            <div className="center-card" key={center.id}>

              {/* LEFT */}
              <div className="center-left">
                <img src={center.image} alt={center.name} />
                <h3>📍 {center.name}</h3>

                <p><strong>Address:</strong> {center.address}</p>
                <p><strong>Phone:</strong> {center.phone}</p>
                <p><strong>Timing:</strong> {center.timing}</p>
              </div>

              {/* RIGHT */}
              <div className="center-right">
                <iframe src={center.map} title={center.name}></iframe>

                <form onSubmit={(e) => handleSubmit(e, center)}>
                  <h4>Enquiry</h4>

                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />

                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />

                  <textarea
                    name="message"
                    placeholder="Message"
                    value={formData.message}
                    onChange={handleChange}
                  />

                  <button type="submit">Send</button>
                </form>
              </div>

            </div>
          ))}
      </div>

    </section>
  );
}