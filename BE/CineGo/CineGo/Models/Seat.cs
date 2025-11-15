using System;
using System.Collections.Generic;

namespace CineGo.Models;

public partial class Seat
{
    public int SeatId { get; set; }

    public int AuditoriumId { get; set; }

    public string Row { get; set; } = null!;

    public int Number { get; set; }

    public string Label { get; set; } = null!;

    public int? SeatTypeId { get; set; }

    public bool IsAvailable { get; set; }

    public virtual Auditorium Auditorium { get; set; } = null!;

    public virtual ICollection<SeatReservation> SeatReservations { get; set; } = new List<SeatReservation>();

    public virtual SeatType? SeatType { get; set; }

    public virtual ICollection<Ticket> Tickets { get; set; } = new List<Ticket>();
}
