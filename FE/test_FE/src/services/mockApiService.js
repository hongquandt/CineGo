// Service giả lập API cho CineGo Booking
// Sẽ được thay thế bằng API thật khi backend ASP.NET sẵn sàng

// Mock data cho các suất chiếu
// Mỗi suất chiếu có startTime và endTime (duration thường là 2 giờ)
const mockShowtimes = [
  { id: 1, time: '06:30', endTime: '08:30', available: true },
  { id: 2, time: '09:30', endTime: '11:30', available: true },
  { id: 3, time: '12:00', endTime: '14:00', available: true },
  { id: 4, time: '16:30', endTime: '18:30', available: true },
  { id: 5, time: '20:00', endTime: '22:00', available: true },
];

// Mock data cho trạng thái ghế
// Cấu trúc: { row: 'A', seat: 1, status: 'available' | 'occupied' | 'held' | 'selected' }
const initialSeats = [
  // Row A: 9 ghế (chỉ hiển thị ở block trái)
  { row: 'A', seat: 1, status: 'available' },
  { row: 'A', seat: 2, status: 'available' },
  { row: 'A', seat: 3, status: 'available' },
  { row: 'A', seat: 4, status: 'available' },
  { row: 'A', seat: 5, status: 'available' },
  { row: 'A', seat: 6, status: 'available' },
  { row: 'A', seat: 7, status: 'occupied' },
  { row: 'A', seat: 8, status: 'occupied' },
  { row: 'A', seat: 9, status: 'occupied' },
  
  // Row B: 9 ghế
  { row: 'B', seat: 1, status: 'available' },
  { row: 'B', seat: 2, status: 'available' },
  { row: 'B', seat: 3, status: 'available' },
  { row: 'B', seat: 4, status: 'occupied' },
  { row: 'B', seat: 5, status: 'occupied' },
  { row: 'B', seat: 6, status: 'available' },
  { row: 'B', seat: 7, status: 'available' },
  { row: 'B', seat: 8, status: 'available' },
  { row: 'B', seat: 9, status: 'available' },
  
  // Row C-G: 18 ghế mỗi hàng (9 trái + 9 phải)
  ...['C', 'D', 'E', 'F', 'G'].flatMap(row => 
    Array.from({ length: 18 }, (_, i) => ({
      row,
      seat: i + 1,
      status: (row === 'D' && [4, 5].includes(i + 1)) ? 'occupied' : 'available'
    }))
  ),
];

// Lưu trữ trạng thái ghế trong memory (sẽ thay bằng API call)
let seatsData = [...initialSeats];
let heldSeats = new Map(); // Map<seatId, { expiresAt: timestamp }>

// Utility: Tạo seat ID
const getSeatId = (row, seat) => `${row}-${seat}`;

// Utility: Tìm ghế
const findSeat = (row, seat) => {
  return seatsData.find(s => s.row === row && s.seat === seat);
};

// Utility: Kiểm tra ghế có bị hold không
const isSeatHeld = (row, seat) => {
  const seatId = getSeatId(row, seat);
  const held = heldSeats.get(seatId);
  if (!held) return false;
  
  // Kiểm tra TTL
  if (Date.now() > held.expiresAt) {
    heldSeats.delete(seatId);
    return false;
  }
  
  return true;
};

// API Service Functions
export const mockApiService = {
  // Lấy danh sách suất chiếu
  async getShowtimes() {
    // Giả lập delay network
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockShowtimes;
  },

  // Lấy trạng thái ghế cho một suất chiếu
  async getSeats(showtimeId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Làm sạch các ghế đã hết hạn hold
    const now = Date.now();
    for (const [seatId, held] of heldSeats.entries()) {
      if (now > held.expiresAt) {
        heldSeats.delete(seatId);
        const [row, seat] = seatId.split('-');
        const seatObj = findSeat(row, parseInt(seat));
        if (seatObj && seatObj.status === 'held') {
          seatObj.status = 'available';
        }
      }
    }
    
    // Trả về ghế với trạng thái đúng (held nếu đang được hold, occupied nếu đã đặt, available nếu còn trống)
    return seatsData.map(seat => {
      // Nếu ghế đang được hold và chưa hết hạn, trả về status 'held'
      if (isSeatHeld(seat.row, seat.seat)) {
        return { ...seat, status: 'held' };
      }
      // Nếu ghế đã occupied, giữ nguyên
      if (seat.status === 'occupied') {
        return { ...seat };
      }
      // Còn lại là available
      return { ...seat, status: 'available' };
    });
  },

  // Hold ghế (giữ ghế tạm thời với TTL)
  async holdSeat(showtimeId, row, seat, ttlSeconds = 300) {
    await new Promise(resolve => setTimeout(resolve, 150));
    
    const seatObj = findSeat(row, seat);
    if (!seatObj) {
      throw new Error('Ghế không tồn tại');
    }
    
    if (seatObj.status === 'occupied') {
      throw new Error('Ghế đã được đặt');
    }
    
    if (isSeatHeld(row, seat)) {
      throw new Error('Ghế đang được giữ bởi người khác');
    }
    
    const seatId = getSeatId(row, seat);
    heldSeats.set(seatId, {
      expiresAt: Date.now() + ttlSeconds * 1000
    });
    
    if (seatObj.status === 'available') {
      seatObj.status = 'held';
    }
    
    return { success: true, expiresAt: heldSeats.get(seatId).expiresAt };
  },

  // Release ghế (hủy hold)
  async releaseSeat(showtimeId, row, seat) {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const seatId = getSeatId(row, seat);
    heldSeats.delete(seatId);
    
    const seatObj = findSeat(row, seat);
    if (seatObj && seatObj.status === 'held') {
      seatObj.status = 'available';
    }
    
    return { success: true };
  },

  // Xác nhận đặt ghế
  async confirmBooking(showtimeId, seats) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Validate tất cả ghế có thể đặt
    for (const { row, seat } of seats) {
      const seatObj = findSeat(row, seat);
      if (!seatObj) {
        throw new Error(`Ghế ${row}${seat} không tồn tại`);
      }
      if (seatObj.status === 'occupied') {
        throw new Error(`Ghế ${row}${seat} đã được đặt`);
      }
    }
    
    // Đánh dấu ghế là occupied
    for (const { row, seat } of seats) {
      const seatObj = findSeat(row, seat);
      seatObj.status = 'occupied';
      const seatId = getSeatId(row, seat);
      heldSeats.delete(seatId);
    }
    
    return {
      success: true,
      bookingId: `BK-${Date.now()}`,
      seats,
      showtimeId
    };
  },

  // Reset trạng thái (để test)
  resetSeats() {
    seatsData = [...initialSeats];
    heldSeats.clear();
  }
};

export default mockApiService;
