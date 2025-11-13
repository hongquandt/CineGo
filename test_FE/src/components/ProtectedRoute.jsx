"use client"

import { useAuth } from "../contexts/AuthContext"

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()

  // Mock: Tự động login với user demo để test
  // Trong thực tế, sẽ redirect đến trang login
  if (!isAuthenticated) {
    // Tự động tạo user demo
    const mockUser = {
      id: 1,
      name: "Nguyễn Văn A",
      email: "user@example.com",
      avatar: null,
      phone: "0123456789",
    }
    // Sẽ được xử lý bởi AuthProvider
    return children
  }

  return children
}

export default ProtectedRoute
