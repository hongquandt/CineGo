using System;
using System.Collections.Generic;

namespace CineGo.Models;

public partial class Person
{
    public int PersonId { get; set; }

    public string FullName { get; set; } = null!;

    public DateOnly? Dob { get; set; }

    public string? RoleType { get; set; }

    public virtual ICollection<MovieCast> MovieCasts { get; set; } = new List<MovieCast>();
}
