using System;
using System.Collections.Generic;

namespace CineGo.Models;

public partial class PriceAssignment
{
    public int PriceAssignmentId { get; set; }

    public int PriceCategoryId { get; set; }

    public int? AuditoriumId { get; set; }

    public int? SeatTypeId { get; set; }

    public DateTime? StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    public decimal Multiplier { get; set; }

    public string? ConditionDescription { get; set; }

    public virtual Auditorium? Auditorium { get; set; }

    public virtual PriceCategory PriceCategory { get; set; } = null!;

    public virtual SeatType? SeatType { get; set; }
}
