using System;
using System.Collections.Generic;

namespace CineGo.Models;

public partial class PriceCategory
{
    public int PriceCategoryId { get; set; }

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public decimal BasePrice { get; set; }

    public bool IsActive { get; set; }

    public virtual ICollection<PriceAssignment> PriceAssignments { get; set; } = new List<PriceAssignment>();

    public virtual ICollection<Screening> Screenings { get; set; } = new List<Screening>();
}
