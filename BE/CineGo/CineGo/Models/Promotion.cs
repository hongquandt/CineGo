using System;
using System.Collections.Generic;

namespace CineGo.Models;

public partial class Promotion
{
    public int PromotionId { get; set; }

    public string? Code { get; set; }

    public string? Description { get; set; }

    public string DiscountType { get; set; } = null!;

    public decimal? DiscountValue { get; set; }

    public DateTime? StartAt { get; set; }

    public DateTime? EndAt { get; set; }

    public int? UsageLimit { get; set; }

    public int UsageCount { get; set; }

    public bool IsActive { get; set; }

    public string? AppliesTo { get; set; }

    public virtual ICollection<PromotionAssignment> PromotionAssignments { get; set; } = new List<PromotionAssignment>();

    public virtual ICollection<PromotionUsage> PromotionUsages { get; set; } = new List<PromotionUsage>();
}
