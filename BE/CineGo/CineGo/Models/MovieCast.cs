using System;
using System.Collections.Generic;

namespace CineGo.Models;

public partial class MovieCast
{
    public int MovieId { get; set; }

    public int PersonId { get; set; }

    public string? CharacterName { get; set; }

    public virtual Movie Movie { get; set; } = null!;

    public virtual Person Person { get; set; } = null!;
}
