// Service giả lập API cho User Account
// Sẽ được thay thế bằng API thật khi backend ASP.NET sẵn sàng

// Mock data cho lịch sử đặt vé
const mockBookings = [
  {
    id: 1,
    bookingId: 'BK-202501011234',
    movieName: 'Alita Battle Angel 2024',
    moviePoster: 'https://via.placeholder.com/150x220?text=Alita',
    duration: '2 hours 15 minutes',
    showtimeDate: '2025-05-13',
    showtimeTime: '17:00',
    theaterName: 'CGV Vincom Center',
    seats: ['B12', 'B13'],
    totalAmount: 140000,
    bookingDate: '2025-05-10T10:30:00',
    status: 'pending_payment', // Chờ thanh toán
    isPaid: false,
  },
  {
    id: 2,
    bookingId: 'BK-202501021456',
    movieName: 'Avengers: Endgame',
    moviePoster: 'https://via.placeholder.com/150x220?text=Avengers',
    duration: '3 hours 1 minute',
    showtimeDate: '2025-05-15',
    showtimeTime: '20:00',
    theaterName: 'CGV Landmark',
    seats: ['D5', 'D6', 'D7'],
    totalAmount: 270000,
    bookingDate: '2025-05-08T14:20:00',
    status: 'confirmed', // Đã thanh toán và trong thời gian chiếu
    isPaid: true,
  },
  {
    id: 3,
    bookingId: 'BK-202501031789',
    movieName: 'Spider-Man: No Way Home',
    moviePoster: 'https://via.placeholder.com/150x220?text=Spider-Man',
    duration: '2 hours 28 minutes',
    showtimeDate: '2025-01-12',
    showtimeTime: '18:30',
    theaterName: 'CGV Crescent Mall',
    seats: ['E10', 'E11'],
    totalAmount: 180000,
    bookingDate: '2025-01-08T14:20:00',
    status: 'expired', // Đã hết hạn/quá giờ chiếu
    isPaid: true,
  },
  {
    id: 4,
    bookingId: 'BK-202501041012',
    movieName: 'Dune: Part Two',
    moviePoster: 'https://via.placeholder.com/150x220?text=Dune',
    duration: '2 hours 46 minutes',
    showtimeDate: '2025-05-20',
    showtimeTime: '19:30',
    theaterName: 'CGV Vincom Center',
    seats: ['F8', 'F9'],
    totalAmount: 180000,
    bookingDate: '2025-05-05T09:15:00',
    status: 'confirmed',
    isPaid: true,
  },
  {
    id: 5,
    bookingId: 'BK-202501051314',
    movieName: 'The Matrix Resurrections',
    moviePoster: 'https://via.placeholder.com/150x220?text=Matrix',
    duration: '2 hours 28 minutes',
    showtimeDate: '2025-05-18',
    showtimeTime: '21:00',
    theaterName: 'CGV Landmark',
    seats: ['C15', 'C16'],
    totalAmount: 180000,
    bookingDate: '2025-05-03T11:00:00',
    status: 'pending_payment',
    isPaid: false,
  },
];

// Mock data cho phim yêu thích (11 phim)
const mockFavorites = [
  {
    id: 1,
    title: 'Avengers: Endgame',
    poster: 'https://via.placeholder.com/280x400?text=Avengers',
    rating: 8.5,
    genre: 'Action, Sci-Fi',
    description: 'The epic conclusion to the Infinity Saga.',
  },
  {
    id: 2,
    title: 'Spider-Man: No Way Home',
    poster: 'https://via.placeholder.com/280x400?text=Spider-Man',
    rating: 8.8,
    genre: 'Action, Adventure',
    description: 'Peter Parker faces the multiverse.',
  },
  {
    id: 3,
    title: 'Dune: Part Two',
    poster: 'https://via.placeholder.com/280x400?text=Dune',
    rating: 9.0,
    genre: 'Sci-Fi, Drama',
    description: 'Paul Atreides continues his journey on Arrakis.',
  },
  {
    id: 4,
    title: 'The Matrix Resurrections',
    poster: 'https://via.placeholder.com/280x400?text=Matrix',
    rating: 7.5,
    genre: 'Sci-Fi, Action',
    description: 'Neo returns to the Matrix once more.',
  },
  {
    id: 5,
    title: 'Inception',
    poster: 'https://via.placeholder.com/280x400?text=Inception',
    rating: 8.8,
    genre: 'Sci-Fi, Thriller',
    description: 'A mind-bending journey through dreams.',
  },
  {
    id: 6,
    title: 'Interstellar',
    poster: 'https://via.placeholder.com/280x400?text=Interstellar',
    rating: 8.6,
    genre: 'Sci-Fi, Drama',
    description: 'A journey beyond our solar system.',
  },
  {
    id: 7,
    title: 'The Dark Knight',
    poster: 'https://via.placeholder.com/280x400?text=Dark+Knight',
    rating: 9.0,
    genre: 'Action, Crime',
    description: 'Batman faces his greatest enemy.',
  },
  {
    id: 8,
    title: 'Pulp Fiction',
    poster: 'https://via.placeholder.com/280x400?text=Pulp+Fiction',
    rating: 8.9,
    genre: 'Crime, Drama',
    description: 'A nonlinear crime masterpiece.',
  },
  {
    id: 9,
    title: 'The Shawshank Redemption',
    poster: 'https://via.placeholder.com/280x400?text=Shawshank',
    rating: 9.3,
    genre: 'Drama',
    description: 'A story of hope and friendship.',
  },
  {
    id: 10,
    title: 'Forrest Gump',
    poster: 'https://via.placeholder.com/280x400?text=Forrest+Gump',
    rating: 8.8,
    genre: 'Drama, Romance',
    description: 'Life is like a box of chocolates.',
  },
  {
    id: 11,
    title: 'The Godfather',
    poster: 'https://via.placeholder.com/280x400?text=Godfather',
    rating: 9.2,
    genre: 'Crime, Drama',
    description: 'The epic saga of the Corleone family.',
  },
];

// Mock data cho phương thức thanh toán
const mockPaymentMethods = [
  {
    id: 1,
    type: 'Visa',
    cardNumber: '4532123456789012',
    cardHolder: 'NGUYEN VAN A',
    expiryDate: '12/25',
    isDefault: true,
  },
  {
    id: 2,
    type: 'Mastercard',
    cardNumber: '5555123456789012',
    cardHolder: 'NGUYEN VAN A',
    expiryDate: '06/26',
    isDefault: false,
  },
];

// Lưu trữ trong memory (sẽ thay bằng API call)
let bookingsData = [...mockBookings];
let favoritesData = [...mockFavorites];
let paymentMethodsData = [...mockPaymentMethods];

export const userAccountService = {
  // Cập nhật thông tin cá nhân
  async updateProfile(data) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { ...data, updatedAt: new Date().toISOString() };
  },

  // Lấy lịch sử đặt vé
  async getBookingHistory() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return bookingsData.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate));
  },

  // Lấy danh sách phim yêu thích
  async getFavorites() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return favoritesData;
  },

  // Xóa phim khỏi yêu thích
  async removeFavorite(movieId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    favoritesData = favoritesData.filter(fav => fav.id !== movieId);
    return { success: true };
  },

  // Lấy phương thức thanh toán
  async getPaymentMethods() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return paymentMethodsData;
  },

  // Thêm phương thức thanh toán
  async addPaymentMethod(cardData) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newCard = {
      id: paymentMethodsData.length + 1,
      ...cardData,
    };
    
    // Nếu là thẻ mặc định, bỏ default của các thẻ khác
    if (cardData.isDefault) {
      paymentMethodsData.forEach(card => {
        card.isDefault = false;
      });
    }
    
    paymentMethodsData.push(newCard);
    return newCard;
  },

  // Xóa phương thức thanh toán
  async deletePaymentMethod(cardId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    paymentMethodsData = paymentMethodsData.filter(card => card.id !== cardId);
    return { success: true };
  },

  // Đặt thẻ mặc định
  async setDefaultPaymentMethod(cardId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    paymentMethodsData.forEach(card => {
      card.isDefault = card.id === cardId;
    });
    return { success: true };
  },

  // Đổi mật khẩu
  async changePassword(data) {
    await new Promise(resolve => setTimeout(resolve, 500));
    // Mock validation
    if (data.currentPassword === 'wrong') {
      throw new Error('Mật khẩu hiện tại không đúng');
    }
    return { success: true };
  },

  // Cập nhật cài đặt thông báo
  async updateNotificationSettings(data) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { ...data, updatedAt: new Date().toISOString() };
  },
};

export default userAccountService;

