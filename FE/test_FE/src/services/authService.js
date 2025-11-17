// src/services/authService.js

// SỬA LỖI: Cổng HTTP đúng (từ launchSettings.json) là 5232
const API_URL = "http://localhost:5232/api/auth";

/**
 * Xử lý response từ fetch (Cải tiến để debug)
 */
const handleResponse = async (response) => {
  // Lấy nội dung text trước, vì response lỗi có thể không phải JSON
  const text = await response.text();
  let data;

  try {
    data = JSON.parse(text);
  } catch (err) {
    // Nếu server trả về lỗi 500 (thường là HTML) hoặc text rỗng
    console.error("Server trả về không phải JSON:", text);
    throw new Error(
      `Lỗi server: ${response.status} ${
        response.statusText
      }. Chi tiết: ${text.substring(0, 100)}...`
    );
  }

  if (!response.ok) {
    // Lỗi 4xx (ví dụ: validation, sai pass, email trùng)
    const error =
      (data && data.message) || // Lỗi từ AuthController
      (data && data.title) || // Lỗi 500 hoặc validation
      (data && data.errors ? JSON.stringify(data.errors) : response.statusText);

    console.error("Lỗi API (4xx):", data);
    throw new Error(error);
  }

  // Nếu OK
  return data;
};

export const authService = {
  /**
   * Gọi API đăng nhập
   */
  login: async (phone, password) => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, password }),
    };

    // Thêm .catch để bắt lỗi "Failed to fetch" (nếu API không chạy)
    const response = await fetch(`${API_URL}/login`, requestOptions).catch(
      (networkError) => {
        console.error("Lỗi mạng:", networkError.message);
        throw new Error(
          "Không thể kết nối tới server. API có đang chạy không? (Kiểm tra cổng API_URL trong authService.js)"
        );
      }
    );
    return handleResponse(response); // Trả về { token, user }
  },

  /**
   * Gọi API đăng ký
   */
  register: async (registerData) => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registerData),
    };

    // Thêm .catch để bắt lỗi "Failed to fetch" (nếu API không chạy)
    const response = await fetch(`${API_URL}/register`, requestOptions).catch(
      (networkError) => {
        console.error("Lỗi mạng:", networkError.message);
        throw new Error(
          "Không thể kết nối tới server. API có đang chạy không? (Kiểm tra cổng API_URL trong authService.js)"
        );
      }
    );
    return handleResponse(response); // Trả về { message }
  },
};

export default authService;
