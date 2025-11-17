// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  // Nếu AuthContext vẫn đang load (chưa kịp check localStorage)
  // thì chưa làm gì cả (tránh redirect oan)
  if (isLoading) {
    return <div>Đang tải...</div>; // Hoặc component Spinner
  }

  // Nếu load xong và KHÔNG xác thực, redirect về trang auth
  if (!isAuthenticated) {
    // Chuyển hướng người dùng về trang đăng nhập
    // `replace` để thay thế history, tránh user bấm "Back" quay lại được
    return <Navigate to="/auth" replace />;
  }

  // Nếu đã xác thực, render component con (UserAccountLayout)
  return children;
}

export default ProtectedRoute;
