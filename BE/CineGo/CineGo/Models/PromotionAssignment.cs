using System;
using System.Collections.Generic;

namespace CineGo.Models;

public partial class PromotionAssignment
{
    public int PromotionAssignmentId { get; set; }

    public int PromotionId { get; set; }

    public int MovieId { get; set; }

    public int ScreeningId { get; set; }

    public int CinemaId { get; set; }

    public virtual Cinema Cinema { get; set; } = null!;

    public virtual Movie Movie { get; set; } = null!;

    public virtual Promotion Promotion { get; set; } = null!;

    public virtual Screening Screening { get; set; } = null!;
}
