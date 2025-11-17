using System;
using System.Collections.Generic;

namespace CineGo.Models;

public partial class Ticket
{
    public int TicketId { get; set; }

    public int BookingId { get; set; }

    public int ScreeningId { get; set; }

    public int SeatId { get; set; }

    public decimal Price { get; set; }

    public string? TicketType { get; set; }

    public string Status { get; set; } = null!;

    public string? Barcode { get; set; }

    public string? SeatLabel { get; set; }

    public DateTime? IssuedAt { get; set; }

    public DateTime? CheckedInAt { get; set; }

    public virtual Booking Booking { get; set; } = null!;

    public virtual Screening Screening { get; set; } = null!;

    public virtual Seat Seat { get; set; } = null!;
}
