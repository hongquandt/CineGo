import React, { use } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.js";
import Home from "./pages/Home.js";
import Movie from "./pages/Movie.js";
import MovieDetail from "./pages/MovieDetail.js";
import SeatLayout from "./pages/SeatLayout.js";
import Favorite from "./pages/Favorite.js";
import MyBooking from "./pages/MyBooking.js";
const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie" element={<Movie />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/movie/:id/:date" element={<SeatLayout />} />
        <Route path="/favorite" element={<Favorite />} />
        <Route path="/my-bookings" element={<MyBooking />} />
      </Routes>
    </>
  );
};

export default App;
