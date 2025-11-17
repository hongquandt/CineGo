using System;
using System.Collections.Generic;

namespace CineGo.Models;

public partial class Review
{
    public int ReviewId { get; set; }

    public int MovieId { get; set; }

    public int? CustomerId { get; set; }

    public int? MemberId { get; set; }

    public byte Rating { get; set; }

    public string? Title { get; set; }

    public string? Content { get; set; }

    public DateTime? PostedAt { get; set; }

    public bool IsApproved { get; set; }

    public virtual Customer? Customer { get; set; }

    public virtual Member? Member { get; set; }

    public virtual Movie Movie { get; set; } = null!;
}
