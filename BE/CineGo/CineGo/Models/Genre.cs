using System;
using System.Collections.Generic;

namespace CineGo.Models;

public partial class Genre
{
    public int GenreId { get; set; }

    public int MovieId { get; set; }

    public string Name { get; set; } = null!;
}
