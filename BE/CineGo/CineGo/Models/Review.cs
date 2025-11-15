using System;
using System.Collections.Generic;

namespace CineGo.Models;

public partial class Review
{
    public int ReviewId { get; set; }

    public int MovieId { get; set; }

    public int CustomerId { get; set; }

    public byte Rating { get; set; }

    public string? Title { get; set; }

    public string? Content { get; set; }

    public virtual Customer Customer { get; set; } = null!;

    public virtual Movie Movie { get; set; } = null!;
}
