import React from "react";
import Header from "./assets/styles/Header";
import Footer from "./assets/styles/Footer";
import MarvelLogo from "./assets/images/Marvel_Logo.svg";
import "./assets/styles/Home.css";

const Home = () => {
  const movies = [
    {
      id: 1,
      title: "Alita Battle Angel 4k 2019 Movies",
      year: "2018",
      genre: "Action, Adventure",
      duration: "2h 8m",
      rating: "4.5",
      image: "https://image.tmdb.org/t/p/w500/xRWht48C2V8XNfzvPehyClOvDni.jpg",
    },
    {
      id: 2,
      title: "Avengers: Endgame",
      year: "2019",
      genre: "Action, Adventure",
      duration: "3h 1m",
      rating: "4.8",
      image: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
    },
    {
      id: 3,
      title: "Spider-Man: No Way Home",
      year: "2021",
      genre: "Action, Adventure",
      duration: "2h 28m",
      rating: "4.7",
      image: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
    },
    {
      id: 4,
      title: "The Dark Knight",
      year: "2008",
      genre: "Action, Crime",
      duration: "2h 32m",
      rating: "4.9",
      image: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    },
    {
      id: 5,
      title: "Inception",
      year: "2010",
      genre: "Action, Sci-Fi",
      duration: "2h 28m",
      rating: "4.8",
      image: "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57quZFyefl5wStK.jpg",
    },
    {
      id: 6,
      title: "Interstellar",
      year: "2014",
      genre: "Adventure, Drama",
      duration: "2h 49m",
      rating: "4.7",
      image: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    },
    {
      id: 7,
      title: "The Matrix",
      year: "1999",
      genre: "Action, Sci-Fi",
      duration: "2h 16m",
      rating: "4.6",
      image: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    },
    {
      id: 8,
      title: "Guardians of the Galaxy",
      year: "2014",
      genre: "Action, Adventure",
      duration: "2h 1m",
      rating: "4.5",
      image: "https://image.tmdb.org/t/p/w500/r7vmZjiyZw9rpJMQJdXcjgiNHhN.jpg",
    },
  ];

  const trailers = [
    {
      id: 1,
      isMain: true,
      image: "https://image.tmdb.org/t/p/w1280/5YZbUmjbMa3ClvSW1Wj3G6T1f3i.jpg",
    },
    {
      id: 2,
      isMain: false,
      image: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
    },
    {
      id: 3,
      isMain: false,
      image: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
    },
    {
      id: 4,
      isMain: false,
      image: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    },
    {
      id: 5,
      isMain: false,
      image: "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57quZFyefl5wStK.jpg",
    },
    {
      id: 6,
      isMain: false,
      image: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    },
  ];

  return (
    <div className="home">
      <Header />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background">
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <div className="hero-info">
            <img
              src={MarvelLogo}
              alt="Marvel Studios"
              className="marvel-logo"
            />
            <h1 className="hero-title">Guardians of the Galaxy</h1>
            <div className="hero-meta">
              <span className="hero-genre">Action | Adventure | Sci-Fi</span>
              <div className="hero-details">
                <span className="hero-year">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="2"
                      y="3"
                      width="12"
                      height="11"
                      rx="1"
                      stroke="white"
                      strokeWidth="1.2"
                      fill="none"
                    />
                    <path
                      d="M5 1v3M11 1v3M2 6h12"
                      stroke="white"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                  </svg>
                  2018
                </span>
                <span className="hero-duration">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="8"
                      cy="8"
                      r="6.5"
                      stroke="white"
                      strokeWidth="1.2"
                      fill="none"
                    />
                    <path
                      d="M8 5v3l2.5 1.5"
                      stroke="white"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  2h 8m
                </span>
              </div>
            </div>
            <p className="hero-description">
              In a post-apocalyptic world where cities ride on wheels and
              consume each other to survive, two people meet in London and try
              to stop a conspiracy.
            </p>
            <a href="/movies" className="explore-btn">
              Explore Movies
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.5 15L12.5 10L7.5 5"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Now Showing Section */}
      <section className="now-showing">
        <div className="now-showing-container">
          <div className="section-header">
            <h2 className="section-title">Now Showing</h2>
            <a href="/movies" className="view-all-link">
              View All →
            </a>
          </div>
          <div className="movies-grid">
            {movies.map((movie) => (
              <div key={movie.id} className="movie-card">
                <div className="movie-poster">
                  <img src={movie.image} alt={movie.title} />
                </div>
                <div className="movie-info">
                  <h3 className="movie-title">{movie.title}</h3>
                  <p className="movie-details">
                    {movie.year} - {movie.genre} - {movie.duration}
                  </p>
                  <div className="movie-actions">
                    <button className="buy-ticket-btn">Buy Ticket</button>
                    <div className="movie-rating">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8 0L10.163 5.52786L16 6.11146L12 10.0557L12.9443 16L8 13.163L3.05573 16L4 10.0557L0 6.11146L5.837 5.52786L8 0Z"
                          fill="#FFD700"
                        />
                      </svg>
                      <span>{movie.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="show-more-container">
            <button className="show-more-btn">Show more</button>
          </div>
        </div>
      </section>

      {/* Trailers Section */}
      <section className="trailers">
        <div className="trailers-container">
          <h2 className="section-title">Trailers</h2>
          <div className="trailers-content">
            <div className="main-trailer">
              <div
                className="trailer-thumbnail main-thumbnail"
                style={{
                  backgroundImage: `url(${
                    trailers.find((t) => t.isMain)?.image
                  })`,
                }}
              >
                <div className="play-overlay">
                  <svg
                    width="60"
                    height="60"
                    viewBox="0 0 60 60"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="30"
                      cy="30"
                      r="30"
                      fill="white"
                      fillOpacity="0.9"
                    />
                    <path d="M24 18L24 42L42 30L24 18Z" fill="#000" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="trailer-thumbnails">
              {trailers
                .filter((t) => !t.isMain)
                .map((trailer) => (
                  <div
                    key={trailer.id}
                    className="trailer-thumbnail small-thumbnail"
                    style={{ backgroundImage: `url(${trailer.image})` }}
                  >
                    <div className="play-overlay">
                      <svg
                        width="40"
                        height="40"
                        viewBox="0 0 40 40"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx="20"
                          cy="20"
                          r="20"
                          fill="white"
                          fillOpacity="0.9"
                        />
                        <path d="M16 12L16 28L28 20L16 12Z" fill="#000" />
                      </svg>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
