import React from "react";
import "./releases.css";
import Header from "./assets/styles/Header.jsx";
import Footer from "./assets/styles/Footer.jsx";

function Releases() {
  const releaseImages = [
    "https://image.tmdb.org/t/p/w500/9d3NI1cBJL00dN4q21u4b1xl9oB.jpg",
    "https://image.tmdb.org/t/p/w500/5bFK5d3mVTAv4i5TiCztY3Vclq2.jpg",
    "https://image.tmdb.org/t/p/w500/8Vt6mWEReut4FD24QlPx7TibP3Z.jpg",
    "https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",
    "https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg",
    "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    "https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg",
    "https://image.tmdb.org/t/p/w500/r7vmZjiyZw9rpJMQJdXcjgiNHhN.jpg",
    "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57quZFyefl5wStK.jpg",
  ];
  const releases = Array.from({ length: 12 }, (_, i) => i + 1);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="releases-page">
      <Header />
      {/* Page header */}
      <section className="page-header">
        <div className="section-header">
          <h1>Upcoming Releases</h1>
          <p>Discover the latest movies coming to cinemas</p>
        </div>
      </section>

      {/* Filters */}
      <section className="releases-filter">
        <div>
          <div>
            <input type="text" placeholder="Search releases..." />
            <select>
              <option>All Months</option>
              {months.map((month, idx) => (
                <option key={idx}>{month}</option>
              ))}
            </select>
            <select>
              <option>Sort by</option>
              <option>Release Date</option>
              <option>Popularity</option>
              <option>Title A-Z</option>
            </select>
          </div>
        </div>
      </section>

      {/* Releases list */}
      <section className="releases-list">
        <div className="release-grid">
          {releases.map((i) => (
            <div className="release-card" key={i}>
              <img src={releaseImages[i - 1]} alt={`Release ${i}`} />
              <div className="card-content">
                <h3>Upcoming Movie {i}</h3>
                <p className="card-tags">
                  {months[(i - 1) % 12]} 2024, Action, Adventure
                </p>
                <div className="card-release-date">
                  <i className="fas fa-calendar-alt"></i>
                  <span>
                    Release: {months[(i - 1) % 12]} {(i % 28) + 1}, 2024
                  </span>
                </div>
                <p className="card-description">
                  An exciting new movie coming soon to theaters near you.
                </p>
                <div className="card-footer">
                  <a href="/movies" className="btn btn-primary">
                    Pre-order Tickets
                  </a>
                  <span className="rating">
                    <i className="fas fa-heart"></i> Coming Soon
                  </span>
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

export default Releases;
