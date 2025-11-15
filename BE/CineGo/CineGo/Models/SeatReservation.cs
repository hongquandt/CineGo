using System;
using System.Collections.Generic;

namespace CineGo.Models;

public partial class SeatReservation
{
    public int ReservationId { get; set; }

    public int ScreeningId { get; set; }

    public int SeatId { get; set; }

    public int? BookingId { get; set; }

    public DateTime ReservedUntil { get; set; }

    public string Status { get; set; } = null!;

    public virtual Booking? Booking { get; set; }

    public virtual Screening Screening { get; set; } = null!;

    public virtual Seat Seat { get; set; } = null!;
}
