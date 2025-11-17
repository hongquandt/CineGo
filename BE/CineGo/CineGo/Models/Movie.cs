using System;
using System.Collections.Generic;

namespace CineGo.Models;

public partial class Movie
{
    public int MovieId { get; set; }

    public string Title { get; set; } = null!;

    public string? Synopsis { get; set; }

    public int DurationMinutes { get; set; }

    public string? Language { get; set; }

    public DateOnly? ReleaseDate { get; set; }

    public string? Country { get; set; }

    public string? Rating { get; set; }

    public string? PosterURL { get; set; }

    public string? TrailerURL { get; set; }

    public string Status { get; set; } = null!;

    public bool IsActive { get; set; }

    public virtual ICollection<MovieCast> MovieCasts { get; set; } = new List<MovieCast>();

    public virtual ICollection<MovieGenre> MovieGenres { get; set; } = new List<MovieGenre>();

    public virtual ICollection<PromotionAssignment> PromotionAssignments { get; set; } = new List<PromotionAssignment>();

    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();

    public virtual ICollection<Screening> Screenings { get; set; } = new List<Screening>();
}
