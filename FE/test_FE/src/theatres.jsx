import React from "react";
import "./theatres.css";
import Header from "./assets/styles/Header.jsx";
import Footer from "./assets/styles/Footer.jsx";

function Theatres() {
  const theatreImages = [
    "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1478720568477-1520d46b8d7b?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=800&h=500&fit=crop",
  ];
  const theatres = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="theatres-page">
      <Header />
      {/* Page header */}
      <section className="page-header">
        <div className="section-header">
          <h1>Our Theatres</h1>
          <p>Find the perfect cinema experience near you</p>
        </div>
      </section>

      {/* Filters */}
      <section className="theatres-filter">
        <div>
          <div>
            <input type="text" placeholder="Search theatres..." />
            <select>
              <option>All Locations</option>
              <option>Ho Chi Minh City</option>
              <option>Ha Noi</option>
              <option>Da Nang</option>
              <option>Can Tho</option>
            </select>
            <select>
              <option>Sort by</option>
              <option>Distance</option>
              <option>Rating</option>
              <option>Name A-Z</option>
            </select>
          </div>
        </div>
      </section>

      {/* Theatres list */}
      <section className="theatres-list">
        <div className="theatre-grid">
          {theatres.map((i) => (
            <div className="theatre-card" key={i}>
              <img src={theatreImages[i - 1]} alt={`Theatre ${i}`} />
              <div className="card-content">
                <h3>Theatre Name {i}</h3>
                <p className="card-location">
                  <i className="fas fa-map-marker-alt"></i> Location {i}, City
                </p>
                <div className="card-info">
                  <span>
                    <i className="fas fa-star"></i>{" "}
                    {(4 + (i % 10) * 0.1).toFixed(1)}
                  </span>
                  <span>
                    <i className="fas fa-users"></i> {50 + i * 10} seats
                  </span>
                </div>
                <div className="card-footer">
                  <a href="/movies" className="btn btn-primary">
                    View Showtimes
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 40 }}>
          <a href="#" className="btn btn-primary btn-show-more">
            Load More
          </a>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default Theatres;
