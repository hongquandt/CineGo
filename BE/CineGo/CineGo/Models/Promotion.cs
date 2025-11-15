using System;
using System.Collections.Generic;

namespace CineGo.Models;

public partial class Promotion
{
    public int PromotionId { get; set; }

    public string? Code { get; set; }

    public string? Description { get; set; }

    public decimal? DiscountValue { get; set; }

    public DateTime? StartAt { get; set; }

    public DateTime? EndAt { get; set; }

    public int? UsageLimit { get; set; }

    public bool IsActive { get; set; }

    public virtual ICollection<PromotionAssignment> PromotionAssignments { get; set; } = new List<PromotionAssignment>();
}
