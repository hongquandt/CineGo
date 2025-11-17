using System;
using System.Collections.Generic;

namespace CineGo.Models;

public partial class PromotionUsage
{
    public int UsageId { get; set; }

    public int PromotionId { get; set; }

    public int BookingId { get; set; }

    public decimal DiscountApplied { get; set; }

    public DateTime? UsedAt { get; set; }

    public virtual Booking Booking { get; set; } = null!;

    public virtual Promotion Promotion { get; set; } = null!;
}

