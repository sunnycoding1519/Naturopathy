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
    image: "/Images/centers/center UP.jpeg",
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
    image: "/Images/centers/centers 2.jpeg",
    map: "https://www.google.com/maps?q=Ajmer&output=embed",
    scripturl: "YOUR_SCRIPT_URL"
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