import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Movies from "./movies";
import Theatres from "./theatres";
import Releases from "./releases";
import Auth from "./auth";
import Home from "./Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/theatres" element={<Theatres />} />
        <Route path="/releases" element={<Releases />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
