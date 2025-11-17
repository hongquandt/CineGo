using System;
using System.Collections.Generic;

namespace CineGo.Models;

public partial class Screening
{
    public int ScreeningId { get; set; }

    public int MovieId { get; set; }

    public int AuditoriumId { get; set; }

    public DateTime StartAt { get; set; }

    public DateTime EndAt { get; set; }

    public string? Language { get; set; }

    public string? Subtitles { get; set; }

    public string Status { get; set; } = null!;

    public int? PriceCategoryId { get; set; }

    public bool Is3D { get; set; }

    public virtual Auditorium Auditorium { get; set; } = null!;

    public virtual Movie Movie { get; set; } = null!;

    public virtual PriceCategory? PriceCategory { get; set; }

    public virtual ICollection<PromotionAssignment> PromotionAssignments { get; set; } = new List<PromotionAssignment>();

    public virtual ICollection<SeatReservation> SeatReservations { get; set; } = new List<SeatReservation>();

    public virtual ICollection<Ticket> Tickets { get; set; } = new List<Ticket>();
}
