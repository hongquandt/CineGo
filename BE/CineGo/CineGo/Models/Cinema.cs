using System;
using System.Collections.Generic;

namespace CineGo.Models;

public partial class Cinema
{
    public int CinemaId { get; set; }

    public string Name { get; set; } = null!;

    public string? Address { get; set; }

    public string? City { get; set; }

    public string? Phone { get; set; }

    public virtual ICollection<Auditorium> Auditoria { get; set; } = new List<Auditorium>();

    public virtual ICollection<PromotionAssignment> PromotionAssignments { get; set; } = new List<PromotionAssignment>();
}
