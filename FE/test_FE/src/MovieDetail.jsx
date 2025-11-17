"use client"

import { useState } from "react"
import Header from "./assets/styles/Header"
import Footer from "./assets/styles/Footer"
import "./assets/styles/MovieDetail.css"

const MovieDetail = () => {
  const [selectedDate, setSelectedDate] = useState(null)
  const [favorites, setFavorites] = useState(false)

  // Mock movie data
  const movie = {
    id: 1,
    title: "Guardians of the Galaxy",
    language: "ENGLISH",
    rating: 4.5,
    description:
      "From the Marvel Cinematic Universe comes an epic space adventure. Peter Quill, an outlaw who steals a mysterious orb, is hunted by a powerful villain who also desires the object. To escape capture, he forms an unlikely alliance with four disparate misfits - Rocket, a gun-toting raccoon; Groot, a tree-like humanoid; Drax, a brutish green man; and Gamora, the green-skinned daughter of Thanos. Together, they escape their pursuers, only to discover the orb's true power and become entangled in a cosmic conflict.",
    duration: "2h 10m",
    genre: "Action | Adventure",
    releaseDate: "1 May 2023",
    poster: "/guardians-of-the-galaxy-movie-poster.jpg",
    cast: [
      { id: 1, name: "Chris Pratt", role: "Peter Quill", image: "/chris-pratt.jpg" },
      { id: 2, name: "Chris Pratt", role: "Peter Quill", image: "/chris-pratt.jpg" },
      { id: 3, name: "Chris Pratt", role: "Peter Quill", image: "/chris-pratt.jpg" },
      { id: 4, name: "Chris Pratt", role: "Peter Quill", image: "/chris-pratt.jpg" },
      { id: 5, name: "Chris Pratt", role: "Peter Quill", image: "/chris-pratt.jpg" },
      { id: 6, name: "Chris Pratt", role: "Peter Quill", image: "/chris-pratt.jpg" },
      { id: 7, name: "Chris Pratt", role: "Peter Quill", image: "/chris-pratt.jpg" },
    ],
    relatedMovies: [
      {
        id: 1,
        title: "Alita Battle Angel 4& 2019",
        genre: "Sci-Fi | Action | Adventure",
        rating: 4.3,
        image: "/alita-battle-angel.jpg",
      },
      {
        id: 2,
        title: "Alita Battle Angel 4& 2019",
        genre: "Sci-Fi | Action | Adventure",
        rating: 4.3,
        image: "/alita-battle-angel.jpg",
      },
      {
        id: 3,
        title: "Alita Battle Angel 4& 2019",
        genre: "Sci-Fi | Action | Adventure",
        rating: 4.3,
        image: "/alita-battle-angel.jpg",
      },
      {
        id: 4,
        title: "Alita Battle Angel 4& 2019",
        genre: "Sci-Fi | Action | Adventure",
        rating: 4.3,
        image: "/alita-battle-angel.jpg",
      },
    ],
  }

  // Generate dates for calendar
  const generateDates = () => {
    const dates = []
    const today = new Date()
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() + i)
      dates.push({
        id: i,
        day: daysOfWeek[date.getDay()],
        date: date.getDate(),
        fullDate: date,
      })
    }
    return dates
  }

  const dates = generateDates()

  return (
    <>
      <Header />

      <div className="movie-detail-page">

      {/* Hero Section */}
      <section className="movie-hero">
        <div className="hero-content">
          <div className="hero-poster">
            <img src={movie.poster || "/placeholder.svg"} alt={movie.title} />
          </div>
          <div className="hero-info">
            <span className="language-badge">{movie.language}</span>
            <h1 className="movie-title">{movie.title}</h1>
            <div className="rating-section">
              <span className="star">★</span>
              <span className="rating-text">{movie.rating} IMDb Rating</span>
            </div>
            <p className="movie-description">{movie.description}</p>
            <div className="movie-meta">
              <span>
                {movie.duration} • {movie.genre} • {movie.releaseDate}
              </span>
            </div>
            <div className="action-buttons">
              <button className="btn-outline">
                <span>▶</span> Watch Trailer
              </button>
              <button className="btn-primary">Buy Tickets</button>
              <button className={`btn-favorite ${favorites ? "active" : ""}`} onClick={() => setFavorites(!favorites)}>
                ♡
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Cast Section */}
      <section className="cast-section">
        <h2>Your Favorite Cast</h2>
        <div className="cast-list">
          {movie.cast.map((actor) => (
            <div key={actor.id} className="cast-item">
              <img src={actor.image || "/placeholder.svg"} alt={actor.name} />
              <h4>{actor.name}</h4>
              <p>{actor.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Date Selection Section */}
      <section className="date-selection">
        <h2>Choose Date</h2>
        <div className="date-picker">
          <button className="date-nav-btn">‹</button>
          <div className="dates-container">
            {dates.map((d) => (
              <button
                key={d.id}
                className={`date-btn ${selectedDate === d.id ? "active" : ""}`}
                onClick={() => setSelectedDate(d.id)}
              >
                <div className="day">{d.day}</div>
                <div className="date">{d.date}</div>
              </button>
            ))}
          </div>
          <button className="date-nav-btn">›</button>
        </div>
        <button className="btn-book">Book Now</button>
      </section>

      {/* Related Movies Section */}
      <section className="related-section">
        <div className="related-header">
          <h2>You May Also Like</h2>
          <a href="#" className="view-all">
            View All →
          </a>
        </div>
        <div className="movies-grid">
          {movie.relatedMovies.map((m) => (
            <div key={m.id} className="movie-card">
              <div className="movie-poster-card">
                <img src={m.image || "/placeholder.svg"} alt={m.title} />
              </div>
              <h3>{m.title}</h3>
              <p className="movie-card-genre">{m.genre}</p>
              <div className="card-footer">
                <button className="btn-card">Buy Ticket</button>
                <div className="card-rating">★ {m.rating}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Show More Button */}
      <div className="show-more-container">
        <button className="btn-show-more">Show more</button>
      </div>
      </div>

      <Footer />
    </>
  )
}

export default MovieDetail
