import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import BookingPage from "./components/SeatSelection";
import ProtectedRoute from "./components/ProtectedRoute";
import UserAccountLayout from "./components/user-account/UserAccountLayout";
import Profile from "./pages/user-account/Profile";
import BookingHistory from "./pages/user-account/BookingHistory";
import Favorites from "./pages/user-account/Favorites";
import Payments from "./pages/user-account/Payments";
import Settings from "./pages/user-account/Settings";
import Movies from "./movies";
import Theatres from "./theatres";
import Releases from "./releases";
import Auth from "./auth";
import Home from "./Home";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/book" element={<BookingPage />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/theatres" element={<Theatres />} />
            <Route path="/releases" element={<Releases />} />
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <UserAccountLayout />
                </ProtectedRoute>
              }
            >
              <Route path="profile" element={<Profile />} />
              <Route path="bookings" element={<BookingHistory />} />
              <Route path="favorites" element={<Favorites />} />
              <Route path="payments" element={<Payments />} />
              <Route path="settings" element={<Settings />} />
              <Route
                index
                element={<Navigate to="/account/profile" replace />}
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
