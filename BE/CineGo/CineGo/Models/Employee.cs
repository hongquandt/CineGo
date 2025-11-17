using System;
using System.Collections.Generic;

namespace CineGo.Models;

public partial class Employee
{
    public int EmployeeId { get; set; }

    public int? CinemaId { get; set; }

    public string FullName { get; set; } = null!;

    public string? Email { get; set; }

    public string? Phone { get; set; }

    public int? RoleId { get; set; }

    public DateOnly? HireDate { get; set; }

    public bool IsActive { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual Cinema? Cinema { get; set; }

    public virtual Role? Role { get; set; }
}

