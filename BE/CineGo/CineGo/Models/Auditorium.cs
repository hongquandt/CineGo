using System;
using System.Collections.Generic;

namespace CineGo.Models;

public partial class Auditorium
{
    public int AuditoriumId { get; set; }

    public int CinemaId { get; set; }

    public string Name { get; set; } = null!;

    public int? ScreenTypeId { get; set; }

    public int Capacity { get; set; }

    public bool IsActive { get; set; }

    public virtual Cinema Cinema { get; set; } = null!;

    public virtual ICollection<PriceAssignment> PriceAssignments { get; set; } = new List<PriceAssignment>();

    public virtual ScreenType? ScreenType { get; set; }

    public virtual ICollection<Screening> Screenings { get; set; } = new List<Screening>();

    public virtual ICollection<Seat> Seats { get; set; } = new List<Seat>();
}
