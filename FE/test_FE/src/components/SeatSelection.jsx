"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";

import Header from "../assets/styles/Header";
import Footer from "../assets/styles/Footer";

import "../assets/styles/Home.css";

import mockApiService from "../services/mockApiService";
import "../assets/styles/SeatSelection.css";

const TimingSidebar = ({
  showtimes = [],
  selectedShowtime,
  onSelectShowtime,
  isLoading,
}) => {
  return (
    <aside className="timings-sidebar">
      <h3>Available Timings</h3>
      <div className="timing-options">
        {isLoading ? (
          <div className="loading-text">Đang tải...</div>
        ) : showtimes.length === 0 ? (
          <div className="no-showtimes">Không có suất chiếu</div>
        ) : (
          showtimes.map((showtime) => (
            <button
              key={showtime.id}
              className={`timing-btn ${
                selectedShowtime?.id === showtime.id ? "active" : ""
              }`}
              onClick={() => onSelectShowtime(showtime)}
              disabled={!showtime.available}
            >
              <i className="bx bx-time-five"></i>
              <span className="timing-text">
                {showtime.time}{" "}
                {showtime.endTime ? `- ${showtime.endTime}` : ""}
              </span>
            </button>
          ))
        )}
      </div>
    </aside>
  );
};

const SeatMap = ({
  seats = [],
  selectedSeats = [],
  onSeatClick,
  isLoading,
}) => {
  const selectedSeatsMap = useMemo(() => {
    const map = new Set();
    selectedSeats.forEach(({ row, seat }) => {
      map.add(`${row}-${seat}`);
    });
    return map;
  }, [selectedSeats]);

  const seatsByRow = useMemo(() => {
    const grouped = {};
    seats.forEach((seat) => {
      if (!grouped[seat.row]) {
        grouped[seat.row] = [];
      }
      grouped[seat.row].push(seat);
    });

    Object.keys(grouped).forEach((row) => {
      grouped[row].sort((a, b) => a.seat - b.seat);
    });

    return grouped;
  }, [seats]);

  const getSeatStatus = (seat) => {
    const seatKey = `${seat.row}-${seat.seat}`;
    if (selectedSeatsMap.has(seatKey)) {
      return "selected";
    }
    return seat.status;
  };

  const renderSeat = (seat) => {
    const status = getSeatStatus(seat);
    const isClickable = status !== "occupied" && !isLoading;

    return (
      <div
        key={`${seat.row}-${seat.seat}`}
        className={`seat ${status} ${!isClickable ? "disabled" : ""}`}
        onClick={() => isClickable && onSeatClick(seat)}
        title={`${seat.row}${seat.seat} - ${
          status === "available"
            ? "Trống"
            : status === "occupied"
            ? "Đã đặt"
            : status === "held"
            ? "Đang giữ"
            : "Đã chọn"
        }`}
      />
    );
  };

  const sortedRows = useMemo(() => {
    return ["A", "B", "C", "D", "E", "F", "G"].filter((row) => seatsByRow[row]);
  }, [seatsByRow]);

  if (isLoading) {
    return (
      <div className="seat-selection">
        <h2>Select Your Seat</h2>
        <div className="loading-seats">Đang tải bản đồ ghế...</div>
      </div>
    );
  }

  return (
    <section className="seat-selection">
      <h2>Select Your Seat</h2>

      <div className="screen-side">
        <div className="screen-curve"></div>
        <p>SCREEN SIDE</p>
      </div>

      <div className="seat-map-wrapper">
        <div className="seat-map">
          <div className="seat-block">
            {sortedRows.map((row) => {
              const rowSeats = seatsByRow[row];
              const leftSeats = rowSeats.filter((s) => s.seat <= 9);

              return (
                <div key={row} className="seat-row">
                  <span className="row-label">{row}</span>
                  {leftSeats.map(renderSeat)}
                  {leftSeats.length < 9 &&
                    Array.from({ length: 9 - leftSeats.length }).map((_, i) => (
                      <div
                        key={`empty-${i}`}
                        className="seat empty"
                        style={{ visibility: "hidden" }}
                      />
                    ))}
                </div>
              );
            })}
            <div className="seat-row number-row">
              <span className="row-label"></span>
              {Array.from({ length: 9 }, (_, i) => (
                <span key={i + 1}>{i + 1}</span>
              ))}
            </div>
          </div>

          <div className="seat-block">
            <div className="seat-row spacer-row"></div>
            <div className="seat-row spacer-row"></div>

            {sortedRows
              .filter((row) => row !== "A" && row !== "B")
              .map((row) => {
                const rowSeats = seatsByRow[row];
                const rightSeats = rowSeats.filter((s) => s.seat > 9);

                return (
                  <div key={row} className="seat-row">
                    {rightSeats.map(renderSeat)}
                    {rightSeats.length < 9 &&
                      Array.from({ length: 9 - rightSeats.length }).map(
                        (_, i) => (
                          <div
                            key={`empty-${i}`}
                            className="seat empty"
                            style={{ visibility: "hidden" }}
                          />
                        )
                      )}
                  </div>
                );
              })}

            <div className="seat-row number-row">
              {Array.from({ length: 9 }, (_, i) => (
                <span key={`right-${i + 10}`}>{i + 10}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="seat-legend">
        <div className="legend-item">
          <div className="legend-seat available"></div>
          <span className="legend-text">Ghế trống</span>
        </div>
        <div className="legend-item">
          <div className="legend-seat selected"></div>
          <span className="legend-text">Ghế đã chọn</span>
        </div>
        <div className="legend-item">
          <div className="legend-seat occupied"></div>
          <span className="legend-text">Ghế đã có người đặt</span>
        </div>
        <div className="legend-item">
          <div className="legend-seat held"></div>
          <span className="legend-text">Ghế đang được giữ</span>
        </div>
      </div>
    </section>
  );
};

const SeatSelectionUI = ({
  showtimes,
  selectedShowtime,
  onSelectShowtime,
  seats,
  selectedSeats,
  onSeatClick,
  isLoadingShowtimes,
  isLoadingSeats,
  onCheckout,
  isCheckoutLoading,
  selectedSeatsCount,
}) => {
  return (
    <div className="booking-container">
      <TimingSidebar
        showtimes={showtimes}
        selectedShowtime={selectedShowtime}
        onSelectShowtime={onSelectShowtime}
        isLoading={isLoadingShowtimes}
      />
      <div className="seat-section">
        <SeatMap
          seats={seats}
          selectedSeats={selectedSeats}
          onSeatClick={onSeatClick}
          isLoading={isLoadingSeats}
        />

        <button
          className="btn btn-primary btn-checkout"
          onClick={onCheckout}
          disabled={selectedSeatsCount === 0 || isCheckoutLoading}
        >
          {isCheckoutLoading
            ? "Đang xử lý..."
            : `Proceed to checkout (${selectedSeatsCount})`}
          {!isCheckoutLoading && <i className="bx bx-right-arrow-alt"></i>}
        </button>
      </div>
    </div>
  );
};

function BookingPage() {
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);

  const { data: showtimes = [], isLoading: isLoadingShowtimes } = useQuery({
    queryKey: ["showtimes"],
    queryFn: () => mockApiService.getShowtimes(),
  });

  const {
    data: seats = [],
    isLoading: isLoadingSeats,
    refetch: refetchSeats,
  } = useQuery({
    queryKey: ["seats", selectedShowtime?.id],
    queryFn: () => mockApiService.getSeats(selectedShowtime.id),
    enabled: !!selectedShowtime,
    refetchInterval: 5000,
  });

  const holdSeatMutation = useMutation({
    mutationFn: ({ showtimeId, row, seat }) =>
      mockApiService.holdSeat(showtimeId, row, seat, 300),
    onSuccess: () => {
      refetchSeats();
    },
  });

  const releaseSeatMutation = useMutation({
    mutationFn: ({ showtimeId, row, seat }) =>
      mockApiService.releaseSeat(showtimeId, row, seat),
    onSuccess: () => {
      refetchSeats();
    },
  });

  const confirmBookingMutation = useMutation({
    mutationFn: ({ showtimeId, seats }) =>
      mockApiService.confirmBooking(showtimeId, seats),
    onSuccess: (data) => {
      alert(`Đặt ghế thành công! Mã booking: ${data.bookingId}`);
      setSelectedSeats([]);
      refetchSeats();
    },
    onError: (error) => {
      alert(`Lỗi: ${error.message}`);
    },
  });

  const handleSelectShowtime = async (showtime) => {
    if (selectedShowtime && selectedSeats.length > 0) {
      for (const seat of selectedSeats) {
        try {
          await releaseSeatMutation.mutateAsync({
            showtimeId: selectedShowtime.id,
            row: seat.row,
            seat: seat.seat,
          });
        } catch (error) {
          console.warn(
            `Không thể release ghế ${seat.row}${seat.seat}:`,
            error.message
          );
        }
      }
    }
    setSelectedShowtime(showtime);
    setSelectedSeats([]);
  };

  const handleSeatClick = async (seat) => {
    if (!selectedShowtime) {
      alert("Vui lòng chọn suất chiếu trước");
      return;
    }

    const isSelected = selectedSeats.some(
      (s) => s.row === seat.row && s.seat === seat.seat
    );

    if (isSelected) {
      setSelectedSeats((prev) =>
        prev.filter((s) => !(s.row === seat.row && s.seat === seat.seat))
      );
      try {
        await releaseSeatMutation.mutateAsync({
          showtimeId: selectedShowtime.id,
          row: seat.row,
          seat: seat.seat,
        });
      } catch (error) {
        console.warn("Không thể release ghế:", error.message);
      }
    } else {
      if (seat.status === "occupied") {
        alert("Ghế này đã được đặt");
        return;
      }

      if (seat.status === "held") {
        alert("Ghế này đang được giữ bởi người khác");
        return;
      }

      try {
        await holdSeatMutation.mutateAsync({
          showtimeId: selectedShowtime.id,
          row: seat.row,
          seat: seat.seat,
        });
        setSelectedSeats((prev) => [
          ...prev,
          { row: seat.row, seat: seat.seat },
        ]);
      } catch (error) {
        alert(`Không thể chọn ghế: ${error.message}`);
      }
    }
  };

  const handleCheckout = () => {
    if (selectedSeats.length === 0) {
      alert("Vui lòng chọn ít nhất một ghế");
      return;
    }

    if (!selectedShowtime) {
      alert("Vui lòng chọn suất chiếu");
      return;
    }

    if (window.confirm(`Xác nhận đặt ${selectedSeats.length} ghế?`)) {
      confirmBookingMutation.mutate({
        showtimeId: selectedShowtime.id,
        seats: selectedSeats,
      });
    }
  };

  useEffect(() => {
    if (showtimes.length > 0 && !selectedShowtime) {
      setSelectedShowtime(showtimes[0]);
    }
  }, [showtimes, selectedShowtime]);

  return (
    <div className="app">
      <Header />

      <SeatSelectionUI
        showtimes={showtimes}
        selectedShowtime={selectedShowtime}
        onSelectShowtime={handleSelectShowtime}
        isLoadingShowtimes={isLoadingShowtimes}
        seats={seats}
        selectedSeats={selectedSeats}
        onSeatClick={handleSeatClick}
        isLoadingSeats={isLoadingSeats || !selectedShowtime}
        onCheckout={handleCheckout}
        isCheckoutLoading={confirmBookingMutation.isPending}
        selectedSeatsCount={selectedSeats.length}
      />

      <Footer />
    </div>
  );
}

export default BookingPage;
