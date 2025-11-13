import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import userAccountService from "../../services/userAccountService";
import Pagination from "../../components/user-account/Pagination";
import "../../assets/styles/user-account/BookingHistory.css";

const BookingHistory = () => {
  const [activeTab, setActiveTab] = useState("pending_payment"); // Mặc định hiển thị chờ thanh toán
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Số booking mỗi trang

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["user-bookings"],
    queryFn: () => userAccountService.getBookingHistory(),
  });

  // Format ngày tháng theo format: "13th May 2025 • 5:00 PM"
  const formatDateTime = (dateString, timeString) => {
    try {
      const date = new Date(dateString + "T00:00:00");
      const day = date.getDate();
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear();

      // Format time: "5:00 PM"
      const [hours, minutes] = timeString.split(":");
      const hour24 = parseInt(hours);
      const hour12 = hour24 % 12 || 12;
      const ampm = hour24 >= 12 ? "PM" : "AM";
      const formattedTime = `${hour12}:${minutes} ${ampm}`;

      // Format day với suffix: 1st, 2nd, 3rd, 4th, etc.
      const getDaySuffix = (day) => {
        if (day >= 11 && day <= 13) return "th";
        switch (day % 10) {
          case 1:
            return "st";
          case 2:
            return "nd";
          case 3:
            return "rd";
          default:
            return "th";
        }
      };

      return `${day}${getDaySuffix(day)} ${month} ${year} • ${formattedTime}`;
    } catch (error) {
      return `${dateString} • ${timeString}`;
    }
  };

  // Phân loại bookings theo trạng thái
  const categorizedBookings = useMemo(() => {
    const now = new Date();
    return {
      pending_payment: bookings.filter(
        (b) => b.status === "pending_payment" && !b.isPaid
      ),
      confirmed: bookings.filter((b) => {
        // Đã thanh toán và trong thời gian chiếu (chưa quá giờ)
        if (b.isPaid && b.status === "confirmed") {
          const showtimeDateTime = new Date(
            `${b.showtimeDate}T${b.showtimeTime}`
          );
          return showtimeDateTime >= now;
        }
        return false;
      }),
      expired: bookings.filter((b) => {
        // Đã hết hạn: status là expired hoặc đã quá giờ chiếu
        if (b.status === "expired") {
          return true;
        }
        if (b.isPaid && b.status === "confirmed") {
          const showtimeDateTime = new Date(
            `${b.showtimeDate}T${b.showtimeTime}`
          );
          return showtimeDateTime < now;
        }
        return false;
      }),
    };
  }, [bookings]);

  // Lấy danh sách bookings theo tab active
  const filteredBookings = useMemo(() => {
    return categorizedBookings[activeTab] || [];
  }, [categorizedBookings, activeTab]);

  // Tính toán phân trang
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const paginatedBookings = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredBookings.slice(startIndex, endIndex);
  }, [filteredBookings, currentPage, itemsPerPage]);

  // Reset về trang 1 khi đổi tab
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  // Reset về trang 1 khi filteredBookings thay đổi (nếu currentPage vượt quá totalPages)
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [filteredBookings.length, totalPages, currentPage]);

  // Tính tổng số vé (bao gồm cả đã hết hạn/đã xem)
  const totalBookings = bookings.length;
  const totalTickets = useMemo(() => {
    return bookings.reduce((sum, booking) => sum + booking.seats.length, 0);
  }, [bookings]);

  // Đếm số lượng theo từng trạng thái
  const tabCounts = useMemo(
    () => ({
      pending_payment: categorizedBookings.pending_payment.length,
      confirmed: categorizedBookings.confirmed.length,
      expired: categorizedBookings.expired.length,
    }),
    [categorizedBookings]
  );

  const handleContinuePayment = (bookingId) => {
    // Navigate to payment page
    alert(`Chuyển đến trang thanh toán cho booking: ${bookingId}`);
  };

  const handleDownloadTicket = (bookingId) => {
    // Download ticket
    alert(`Tải vé cho booking: ${bookingId}`);
  };

  if (isLoading) {
    return (
      <div className="booking-history-page">
        <h1 className="page-title">My Bookings</h1>
        <div className="loading">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="booking-history-page">
      <div className="booking-header-section">
        <h1 className="page-title">My Bookings</h1>

        {/* Thống kê tổng số vé */}
        <div className="booking-stats-card">
          <div className="stats-item">
            <div className="stats-value">{totalBookings}</div>
            <div className="stats-label">Tổng số vé đã đặt</div>
          </div>
          <div className="stats-divider"></div>
          <div className="stats-item">
            <div className="stats-value">{totalTickets}</div>
            <div className="stats-label">Tổng số ghế</div>
          </div>
        </div>
      </div>

      {/* Tabs để filter theo trạng thái */}
      <div className="booking-tabs">
        <button
          className={`booking-tab ${
            activeTab === "pending_payment" ? "active" : ""
          }`}
          onClick={() => handleTabChange("pending_payment")}
        >
          Chờ thanh toán
          {tabCounts.pending_payment > 0 && (
            <span className="tab-badge">{tabCounts.pending_payment}</span>
          )}
        </button>
        <button
          className={`booking-tab ${activeTab === "confirmed" ? "active" : ""}`}
          onClick={() => handleTabChange("confirmed")}
        >
          Đã mua
          {tabCounts.confirmed > 0 && (
            <span className="tab-badge">{tabCounts.confirmed}</span>
          )}
        </button>
        <button
          className={`booking-tab ${activeTab === "expired" ? "active" : ""}`}
          onClick={() => handleTabChange("expired")}
        >
          Đã hết hạn
          {tabCounts.expired > 0 && (
            <span className="tab-badge">{tabCounts.expired}</span>
          )}
        </button>
      </div>

      {/* Danh sách bookings */}
      {filteredBookings.length === 0 ? (
        <div className="empty-state">
          <i className="bx bx-calendar-x"></i>
          <p>
            {activeTab === "pending_payment" &&
              "Bạn không có vé nào đang chờ thanh toán"}
            {activeTab === "confirmed" && "Bạn không có vé nào đã mua"}
            {activeTab === "expired" && "Bạn không có vé nào đã hết hạn"}
          </p>
        </div>
      ) : (
        <>
          <div className="booking-list">
            {paginatedBookings.map((booking) => (
              <div key={booking.id} className="booking-card">
                {/* Poster phim bên trái */}
                <div className="booking-poster">
                  <img src={booking.moviePoster} alt={booking.movieName} />
                </div>

                {/* Thông tin booking bên phải */}
                <div className="booking-info">
                  <div className="booking-info-header">
                    <h2 className="movie-title">{booking.movieName}</h2>
                    <div className="booking-price">
                      {booking.totalAmount.toLocaleString("vi-VN")} đ
                    </div>
                  </div>

                  <div className="booking-details">
                    <div className="detail-row">
                      <span className="detail-label">Duration:</span>
                      <span className="detail-value">{booking.duration}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Date & Time:</span>
                      <span className="detail-value">
                        {formatDateTime(
                          booking.showtimeDate,
                          booking.showtimeTime
                        )}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Total Tickets:</span>
                      <span className="detail-value">
                        {booking.seats.length}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Seat Number:</span>
                      <span className="detail-value">
                        {booking.seats.join(", ")}
                      </span>
                    </div>
                  </div>

                  <div className="booking-actions">
                    {!booking.isPaid && booking.status === "pending_payment" ? (
                      <button
                        className="btn btn-primary btn-continue-payment"
                        onClick={() => handleContinuePayment(booking.bookingId)}
                      >
                        Tiếp tục thanh toán
                      </button>
                    ) : (
                      // Vé đã thanh toán (confirmed) hoặc đã hết hạn (expired) đều có nút tải vé
                      <button
                        className="btn btn-secondary btn-download"
                        onClick={() => handleDownloadTicket(booking.bookingId)}
                      >
                        <i className="bx bx-download"></i> Tải vé
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}
    </div>
  );
};

export default BookingHistory;
