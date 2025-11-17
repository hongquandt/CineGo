// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import authService from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Thêm state loading

  // Load user từ localStorage khi component mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("cinego_user");
      const savedToken = localStorage.getItem("cinego_token");

      if (savedUser && savedToken) {
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Lỗi khi tải user từ localStorage:", error);
      // Nếu lỗi, dọn dẹp localStorage
      localStorage.removeItem("cinego_user");
      localStorage.removeItem("cinego_token");
    } finally {
      setIsLoading(false); // Dù thành công hay thất bại, cũng dừng loading
    }
  }, []);

  const login = async (phone, password) => {
    // Trả về promise để component có thể xử lý
    return authService
      .login(phone, password)
      .then((data) => {
        // data là { token, user }
        setUser(data.user);
        setIsAuthenticated(true);
        localStorage.setItem("cinego_user", JSON.stringify(data.user));
        localStorage.setItem("cinego_token", data.token);
        return data.user;
      })
      .catch((error) => {
        // Ném lỗi ra để component login có thể bắt
        throw error;
      });
  };

  const register = async (registerData) => {
    // Trả về promise để component có thể xử lý
    return authService
      .register(registerData)
      .then((response) => {
        // Trả về thông báo thành công
        return response.message;
      })
      .catch((error) => {
        // Ném lỗi ra để component register có thể bắt
        throw error;
      });
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("cinego_user");
    localStorage.removeItem("cinego_token");
  };

  const updateUser = (updatedData) => {
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    localStorage.setItem("cinego_user", JSON.stringify(newUser));
  };

  // Chỉ render children khi đã kiểm tra xong auth
  // (Tránh trường hợp ProtectedRoute bị redirect oan)
  if (isLoading) {
    return <div>Đang tải ứng dụng...</div>; // Hoặc một component Spinner
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        register,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
