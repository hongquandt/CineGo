import React, { useState } from "react";
import "./auth.css";
import CineGoLogo from "./assets/images/CineGoLogo.png";

function Auth() {
  const [activeForm, setActiveForm] = useState("login"); // login, register, forget
  const [registerStep, setRegisterStep] = useState(1); // 1 or 2

  const handleRegisterNext = (e) => {
    e.preventDefault();
    if (registerStep === 1) {
      setRegisterStep(2);
    }
  };

  const handleRegisterBack = () => {
    setRegisterStep(1);
  };

  return (
    <div className="auth-page">
      <div className="auth-logo">
        <img src={CineGoLogo} alt="CineGo Logo" />
      </div>
      <section className="auth-section">
        <div className="auth-modal">
          {activeForm === "login" && (
            <div className="auth-form">
              <h2>Login</h2>
              <form>
                <div className="form-group">
                  <input
                    type="text"
                    id="login-phone"
                    placeholder="Phone number"
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    id="login-password"
                    placeholder="Password"
                    required
                  />
                </div>
                <div className="form-options">
                  <label className="checkbox-label">
                    <input type="checkbox" />
                    <span>Remember me</span>
                  </label>
                  <a
                    href="#"
                    className="forget-link"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveForm("forget");
                    }}
                  >
                    Forgot password?
                  </a>
                </div>
                <button type="submit" className="btn btn-primary btn-submit">
                  Login
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
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="email"
                      id="reg-email"
                      placeholder="Email"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="tel"
                      id="reg-phone"
                      placeholder="Phone number"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="date"
                      id="reg-birthdate"
                      placeholder="Date of Birth"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <select id="reg-gender" required>
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
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="password"
                      id="reg-confirm-password"
                      placeholder="Confirm Password"
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary btn-submit">
                    Next
                  </button>
                </form>
              )}

              {registerStep === 2 && (
                <form>
                  <div className="form-group">
                    <input
                      type="text"
                      id="reg-address"
                      placeholder="Address"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      id="reg-city"
                      placeholder="City"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      id="reg-code"
                      placeholder="Verification Code"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="checkbox-label">
                      <input type="checkbox" required />
                      <span>I agree to the Terms and Conditions</span>
                    </label>
                  </div>
                  <div className="form-group">
                    <label className="checkbox-label">
                      <input type="checkbox" required />
                      <span>I agree to the processing of data</span>
                    </label>
                  </div>
                  <button type="submit" className="btn btn-primary btn-submit">
                    Register
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
                  }}
                >
                  Sign in
                </a>
              </p>
            </div>
          )}

          {activeForm === "forget" && (
            <div className="auth-form">
              <h2>Forget Password</h2>
              <p className="auth-subtitle">
                Enter your phone number to receive a reset code
              </p>
              <form>
                <div className="form-group">
                  <input
                    type="tel"
                    id="forget-phone"
                    placeholder="Phone number"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-submit">
                  Send Code
                </button>
                <p className="auth-footer">
                  Remember your password?{" "}
                  <a
                    href="#"
                    className="auth-link"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveForm("login");
                    }}
                  >
                    Sign in
                  </a>
                </p>
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Auth;
