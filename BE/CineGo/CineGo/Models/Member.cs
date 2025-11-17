using System;
using System.Collections.Generic;

namespace CineGo.Models;

public partial class Member
{
    public int MemberId { get; set; }

    public int CustomerId { get; set; }

    public string Username { get; set; } = null!;

    public string PasswordHash { get; set; } = null!;

    public int Points { get; set; }

    public string? MembershipLevel { get; set; }

    public DateTime? JoinDate { get; set; }

    public DateTime? LastLogin { get; set; }

    public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();

    public virtual Customer Customer { get; set; } = null!;

    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();
}
