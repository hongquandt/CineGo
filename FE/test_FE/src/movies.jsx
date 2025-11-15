import React from "react";
import "./movies.css";
import Header from "./assets/styles/Header.jsx";
import Footer from "./assets/styles/Footer.jsx";

function Movies() {
  const movieImages = [
    "https://image.tmdb.org/t/p/w500/xRWht48C2V8XNfzvPehyClOvDni.jpg",
    "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
    "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
    "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57quZFyefl5wStK.jpg",
    "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    "https://image.tmdb.org/t/p/w500/r7vmZjiyZw9rpJMQJdXcjgiNHhN.jpg",
    "https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg",
    "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    "https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",
    "https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg",
    "https://image.tmdb.org/t/p/w500/9d3NI1cBJL00dN4q21u4b1xl9oB.jpg",
    "https://image.tmdb.org/t/p/w500/5bFK5d3mVTAv4i5TiCztY3Vclq2.jpg",
    "https://image.tmdb.org/t/p/w500/8Vt6mWEReut4FD24QlPx7TibP3Z.jpg",
  ];
  const movies = Array.from({ length: 16 }, (_, i) => i + 1);

  return (
    <div className="movies-page">
      <Header />
      {/* Page header */}
      <section className="page-header">
        <div className="section-header">
          <h1>All Movies</h1>
          <p>Discover our complete collection of movies</p>
        </div>
      </section>

      {/* Filters */}
      <section className="movies-filter">
        <div>
          <div>
            <input type="text" placeholder="Search movies..." />
            <select>
              <option>All Genres</option>
              <option>Action</option>
              <option>Adventure</option>
              <option>Comedy</option>
              <option>Drama</option>
              <option>Horror</option>
              <option>Sci-Fi</option>
            </select>
            <select>
              <option>Sort by</option>
              <option>Newest</option>
              <option>Rating</option>
              <option>Title A-Z</option>
            </select>
          </div>
        </div>
      </section>

      {/* Movies list */}
      <section className="movies-list">
        <div className="movie-grid">
          {movies.map((i) => (
            <div className="movie-card" key={i}>
              <img src={movieImages[i - 1]} alt={`Movie Poster ${i}`} />
              <div className="card-content">
                <h3>Movie Title {i}</h3>
                <p className="card-tags">
                  2024, Action, Adventure, 2h {i % 10}m
                </p>
                <div className="card-footer">
                  <a href="/seat-selection" className="btn btn-primary">
                    Buy Tickets
                  </a>
                  <span className="rating">
                    <i className="fas fa-heart"></i>{" "}
                    {(4 + (i % 10) * 0.1).toFixed(1)}
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

export default Movies;
