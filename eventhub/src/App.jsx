import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const [darkMode, setDarkMode] = useState(false);
 const [events, setEvents] = useState(() => {
  const saved = localStorage.getItem("events");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) {
      console.error("Error parsing saved events", e);
    }
  }
  // Fallback defaults
  return [
    {
      id: 1,
      name: "Frontend Bootcamp",
      date: "2026-06-15",
      time: "09:30",
      location: "Online",
      description: "Hands-on React workshop for beginners",
      rsvp: 0
    },
    {
      id: 2,
      name: "Startup Pitch Fest",
      date: "2026-06-20",
      time: "14:00",
      location: "Chennai",
      description: "Pitch your ideas to investors",
      rsvp: 0
    },
    {
      id: 3,
      name: "AI Conference 2026",
      date: "2026-07-01",
      time: "10:00",
      location: "Bangalore",
      description: "A full-day summit on AI trends",
      rsvp: 0
    }
  ];
});


  const [form, setForm] = useState({
    name: "", date: "", time: "", location: "", description: ""
  });
  const [toast, setToast] = useState({ message: "", type: "" });

  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  const toggleMode = () => setDarkMode(!darkMode);

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 2500);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.date || !form.time || !form.location) {
      showToast("Please fill all required fields!", "error");
      return;
    }
    setEvents([...events, { id: Date.now(), ...form, rsvp: 0 }]);
    setForm({ name: "", date: "", time: "", location: "", description: "" });
    showToast("Event added successfully!", "success");
  };

  const handleRSVP = (id) => {
    setEvents(events.map(ev => ev.id === id ? { ...ev, rsvp: ev.rsvp + 1 } : ev));
    showToast("RSVP added!", "success");
  };

  return (
    <div className={`transition-bg ${darkMode ? "dark-mode" : "light-mode"} min-vh-100`}>
      <div className="container py-4">
        <h1 className="neon-text text-center mb-5">EventHub</h1>

        {/* Controls */}
        <div className="d-flex flex-wrap justify-content-between mb-4">
          <button className="btn btn-secondary mb-2" onClick={toggleMode}>
            Toggle {darkMode ? "Light" : "Dark"} Mode
          </button>
          <input type="text" placeholder="Search events..." className="form-control w-50 mb-2" />
        </div>

        {/* Add Event Form */}
        <div className="card p-3 mb-4 shadow-sm">
          <form onSubmit={handleAddEvent}>
            <div className="row g-2">
              <div className="col-md-6">
                <input name="name" value={form.name} onChange={handleChange} placeholder="Event Name" className="form-control" />
              </div>
              <div className="col-md-3">
                <input type="date" name="date" value={form.date} onChange={handleChange} className="form-control" />
              </div>
              <div className="col-md-3">
                <input type="time" name="time" value={form.time} onChange={handleChange} className="form-control" />
              </div>
              <div className="col-md-6">
                <input name="location" value={form.location} onChange={handleChange} placeholder="Location" className="form-control mt-2" />
              </div>
              <div className="col-md-6">
                <input name="description" value={form.description} onChange={handleChange} placeholder="Description (optional)" className="form-control mt-2" />
              </div>
            </div>
            <div className="text-center mt-3">
              <button type="submit" className="btn btn-outline-info glow-btn">+ Add Event</button>
            </div>
          </form>
        </div>

        {/* Event Grid */}
        <div className="row">
          {events.map(ev => (
            <div key={ev.id} className="col-md-6 mb-4">
              <div className="card shadow-sm h-100 event-card">
                <div className="card-body">
                  <h5 className="card-title fw-bold">{ev.name}</h5>
                  <p className="card-text"><strong>Date:</strong> {ev.date} | <strong>Time:</strong> {ev.time}</p>
                  <p className="card-text"><strong>Location:</strong> {ev.location}</p>
                  {ev.description && <p className="card-text text-muted">{ev.description}</p>}
                  <button className="btn btn-primary me-2" onClick={() => handleRSVP(ev.id)}>RSVP</button>
                  <span className="badge bg-success">{ev.rsvp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {toast.message && <div className={`toast-message ${toast.type}`}>{toast.message}</div>}
      </div>
    </div>
  );
}

export default App;
