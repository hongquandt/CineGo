using System;
using System.Collections.Generic;

namespace CineGo.Models;

public partial class Customer
{
    public int CustomerId { get; set; }

    public string? Email { get; set; }

    public string? Phone { get; set; }

    public string FullName { get; set; } = null!;

    public string? Address { get; set; }

    public string? City { get; set; }

    public DateOnly? DateOfBirth { get; set; }

    public string? Gender { get; set; }

    public bool IsMember { get; set; }

    public DateTime? CreatedAt { get; set; }

    public bool IsActive { get; set; }

    public virtual Member? Member { get; set; }

    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();
}
