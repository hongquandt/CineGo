import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "../../assets/styles/user-account/UserAvatar.css";

const UserAvatar = () => {
  const { user, logout, login, isAuthenticated } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Đóng dropdown khi click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Mock login handler
  const handleMockLogin = () => {
    const mockUser = {
      id: 1,
      name: "Nguyễn Văn A",
      email: "user@example.com",
      avatar: null,
      phone: "0123456789",
      dateOfBirth: "",
      gender: "",
      address: "",
    };
    login(mockUser);
  };

  // Nếu chưa đăng nhập, hiển thị nút Login
  if (!isAuthenticated || !user) {
    return (
      <button className="btn btn-primary" onClick={handleMockLogin}>
        Log in
      </button>
    );
  }

  // Lấy chữ cái đầu của tên để hiển thị avatar
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleMenuItemClick = (path) => {
    navigate(path);
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      logout();
      navigate("/");
      setIsDropdownOpen(false);
    }
  };

  return (
    <div className="user-avatar-container" ref={dropdownRef}>
      <button
        className="user-avatar-btn"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        aria-label="User menu"
      >
        {user.avatar ? (
          <img src={user.avatar} alt={user.name} className="user-avatar-img" />
        ) : (
          <div className="user-avatar-placeholder">
            {getInitials(user.name)}
          </div>
        )}
      </button>

      {isDropdownOpen && (
        <div className="user-dropdown">
          <div className="user-dropdown-header">
            <div className="user-dropdown-avatar">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} />
              ) : (
                <div className="user-avatar-placeholder large">
                  {getInitials(user.name)}
                </div>
              )}
            </div>
            <div className="user-dropdown-info">
              <div className="user-dropdown-name">{user.name}</div>
              <div className="user-dropdown-email">{user.email}</div>
            </div>
          </div>

          <div className="user-dropdown-divider"></div>

          <div className="user-dropdown-menu">
            <button
              className="user-dropdown-item"
              onClick={() => handleMenuItemClick("/account/profile")}
            >
              <i className="bx bx-user"></i>
              <span>Thông tin cá nhân</span>
            </button>
            <button
              className="user-dropdown-item"
              onClick={() => handleMenuItemClick("/account/bookings")}
            >
              <i className="bx bx-calendar-check"></i>
              <span>Lịch sử đặt vé</span>
            </button>
            <button
              className="user-dropdown-item"
              onClick={() => handleMenuItemClick("/account/favorites")}
            >
              <i className="bx bx-heart"></i>
              <span>Phim yêu thích</span>
            </button>
            {/* <button
              className="user-dropdown-item"
              onClick={() => handleMenuItemClick('/account/payments')}
            >
              <i className="bx bx-credit-card"></i>
              <span>Thanh toán</span>
            </button> */}
            <button
              className="user-dropdown-item"
              onClick={() => handleMenuItemClick("/account/settings")}
            >
              <i className="bx bx-cog"></i>
              <span>Cài đặt</span>
            </button>
          </div>

          <div className="user-dropdown-divider"></div>

          <button className="user-dropdown-item logout" onClick={handleLogout}>
            <i className="bx bx-log-out"></i>
            <span>Đăng xuất</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
