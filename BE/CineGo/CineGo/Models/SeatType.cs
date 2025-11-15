using System;
using System.Collections.Generic;

namespace CineGo.Models;

public partial class SeatType
{
    public int SeatTypeId { get; set; }

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public virtual ICollection<PriceAssignment> PriceAssignments { get; set; } = new List<PriceAssignment>();

    public virtual ICollection<Seat> Seats { get; set; } = new List<Seat>();
}
