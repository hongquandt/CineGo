using System;
using System.Collections.Generic;

namespace CineGo.Models;

public partial class Booking
{
    public int BookingId { get; set; }

    public int? MemberId { get; set; }

    public string Status { get; set; } = null!;

    public decimal TotalAmount { get; set; }

    public string? BookingReference { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? ExpiresAt { get; set; }

    public virtual Member? Member { get; set; }

    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();

    public virtual ICollection<PromotionUsage> PromotionUsages { get; set; } = new List<PromotionUsage>();

    public virtual ICollection<SeatReservation> SeatReservations { get; set; } = new List<SeatReservation>();

    public virtual ICollection<Ticket> Tickets { get; set; } = new List<Ticket>();
}
