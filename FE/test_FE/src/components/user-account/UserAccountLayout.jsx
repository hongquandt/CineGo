import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Header from "../../assets/styles/Header";
import Footer from "../../assets/styles/Footer";
import "../../assets/styles/user-account/UserAccountLayout.css";

const UserAccountLayout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: "/account/profile", icon: "bx-user", label: "Thông tin cá nhân" },
    {
      path: "/account/bookings",
      icon: "bx-calendar-check",
      label: "Lịch sử đặt vé",
    },
    { path: "/account/favorites", icon: "bx-heart", label: "Phim yêu thích" },
    // { path: '/account/payments', icon: 'bx-credit-card', label: 'Thanh toán' },
    { path: "/account/settings", icon: "bx-cog", label: "Cài đặt" },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="user-account-page">
      <Header />
      <div className="user-account-container">
        <aside className="user-account-sidebar">
          <div className="sidebar-header">
            <h2>Tài khoản</h2>
            <div className="sidebar-user-info">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="sidebar-avatar"
                />
              ) : (
                <div className="sidebar-avatar-placeholder">
                  {user?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </div>
              )}
              <div className="sidebar-user-details">
                <div className="sidebar-user-name">{user?.name}</div>
                <div className="sidebar-user-email">{user?.email}</div>
              </div>
            </div>
          </div>

          <nav className="sidebar-nav">
            {menuItems.map((item) => (
              <button
                key={item.path}
                className={`sidebar-nav-item ${
                  isActive(item.path) ? "active" : ""
                }`}
                onClick={() => navigate(item.path)}
              >
                <i className={`bx ${item.icon}`}></i>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="user-account-content">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default UserAccountLayout;
