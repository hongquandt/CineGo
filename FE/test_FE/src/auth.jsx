import React, { useState } from "react";
import "./auth.css";
import CineGoLogo from "./assets/images/CineGoLogo.png";
import { useAuth } from "./contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function Auth() {
  const [activeForm, setActiveForm] = useState("login"); // login, register, forget
  const [registerStep, setRegisterStep] = useState(1); // 1 or 2

  const { login, register } = useAuth();
  const navigate = useNavigate();

  // === State cho Form Đăng nhập ===
  const [loginPhone, setLoginPhone] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // === State cho Form Đăng ký ===
  const [regData, setRegData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    password: "",
    confirmPassword: "",
    address: "",
    city: "",
  });

  // State chung cho loading và lỗi
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Xử lý thay đổi input cho form đăng ký
  const handleRegChange = (e) => {
    const { id, value } = e.target;
    // Map id (vd: "reg-name") sang key của DTO (vd: "fullName")
    const keyMap = {
      "reg-name": "fullName",
      "reg-email": "email",
      "reg-phone": "phone",
      "reg-birthdate": "dateOfBirth",
      "reg-gender": "gender",
      "reg-password": "password",
      "reg-confirm-password": "confirmPassword",
      "reg-address": "address",
      "reg-city": "city",
    };
    setRegData((prev) => ({ ...prev, [keyMap[id]]: value }));
  };

  // === Xử lý Submit Đăng nhập ===
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await login(loginPhone, loginPassword);
      setIsLoading(false);
      navigate("/account/profile"); // Chuyển về trang profile sau khi login
    } catch (err) {
      setIsLoading(false);
      setError(err.message || "Đăng nhập thất bại. Vui lòng thử lại.");
    }
  };

  // Chuyển bước trong form đăng ký
  const handleRegisterNext = (e) => {
    e.preventDefault();
    setError(null);

    // --- SỬA LỖI: THÊM VALIDATION CHO CÁC TRƯỜNG BẮT BUỘC ---
    if (
      !regData.fullName ||
      !regData.email ||
      !regData.phone ||
      !regData.dateOfBirth ||
      !regData.gender
    ) {
      setError("Vui lòng điền đầy đủ các trường bắt buộc ở Bước 1.");
      return;
    }
    // (Bạn có thể thêm kiểm tra email regex ở đây nếu muốn)
    // ----------------------------------------------------

    if (regData.password !== regData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }
    if (regData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    setRegisterStep(2);
  };

  const handleRegisterBack = () => {
    setRegisterStep(1);
    setError(null);
  };

  // === Xử lý Submit Đăng ký (bước cuối) ===
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Lấy dữ liệu DTO từ state (loại bỏ confirmPassword)
    // Code này bây giờ ĐÚNG vì backend DTO đã xóa ConfirmPassword
    const { confirmPassword, ...dto } = regData;

    try {
      const message = await register(dto);
      setIsLoading(false);
      alert(message); // Thông báo đăng ký thành công
      setActiveForm("login"); // Chuyển về form login
      setRegisterStep(1);
    } catch (err) {
      setIsLoading(false);
      // Lỗi validation (vd: "Email đã tồn tại") sẽ hiển thị ở đây
      setError(err.message || "Đăng ký thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-logo">
        <img src={CineGoLogo} alt="CineGo Logo" />
      </div>
      <section className="auth-section">
        <div className="auth-modal">
          {/* === HIỂN THỊ LỖI CHUNG === */}
          {error && (
            <div
              style={{
                color: "red",
                marginBottom: "15px",
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}

          {activeForm === "login" && (
            <div className="auth-form">
              <h2>Login</h2>
              <form onSubmit={handleLoginSubmit}>
                <div className="form-group">
                  <input
                    type="tel"
                    id="login-phone"
                    placeholder="Phone number"
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    id="login-password"
                    placeholder="Password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="form-options">
                  {/* ... (checkbox, forgot password) ... */}
                </div>
                <button
                  type="submit"
                  className="btn btn-primary btn-submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Đang đăng nhập..." : "Login"}
                </button>
                <p className="auth-footer">
                  Don't have an account?{" "}
                  <a
                    href="#"
                    className="auth-link"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveForm("register");
                      setRegisterStep(1);
                      setError(null);
                    }}
                  >
                    Sign up
                  </a>
                </p>
              </form>
            </div>
          )}

          {activeForm === "register" && (
            <div className="auth-form">
              <h2>Registration</h2>
              {registerStep === 1 && (
                <form onSubmit={handleRegisterNext}>
                  <div className="form-group">
                    <input
                      type="text"
                      id="reg-name"
                      placeholder="Full Name"
                      value={regData.fullName}
                      onChange={handleRegChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="email"
                      id="reg-email"
                      placeholder="Email"
                      value={regData.email}
                      onChange={handleRegChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="tel"
                      id="reg-phone"
                      placeholder="Phone number"
                      value={regData.phone}
                      onChange={handleRegChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="date"
                      id="reg-birthdate"
                      placeholder="Date of Birth"
                      value={regData.dateOfBirth}
                      onChange={handleRegChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <select
                      id="reg-gender"
                      value={regData.gender}
                      onChange={handleRegChange}
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <input
                      type="password"
                      id="reg-password"
                      placeholder="Password"
                      value={regData.password}
                      onChange={handleRegChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="password"
                      id="reg-confirm-password"
                      placeholder="Confirm Password"
                      value={regData.confirmPassword}
                      onChange={handleRegChange}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary btn-submit">
                    Next
                  </button>
                </form>
              )}

              {registerStep === 2 && (
                <form onSubmit={handleRegisterSubmit}>
                  <div className="form-group">
                    <input
                      type="text"
                      id="reg-address"
                      placeholder="Address"
                      value={regData.address}
                      onChange={handleRegChange}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      id="reg-city"
                      placeholder="City"
                      value={regData.city}
                      onChange={handleRegChange}
                    />
                  </div>
                  {/* ... (các trường khác nếu có) ... */}
                  <button
                    type="submit"
                    className="btn btn-primary btn-submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Đang đăng ký..." : "Register"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-back"
                    onClick={handleRegisterBack}
                  >
                    Back
                  </button>
                </form>
              )}

              <p className="auth-footer">
                Already have an account?{" "}
                <a
                  href="#"
                  className="auth-link"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveForm("login");
                    setRegisterStep(1);
                    setError(null);
                  }}
                >
                  Sign in
                </a>
              </p>
            </div>
          )}

          {/* ... (Form Forget Password) ... */}
        </div>
      </section>
    </div>
  );
}

export default Auth;
