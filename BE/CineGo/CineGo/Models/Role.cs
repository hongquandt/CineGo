using System;
using System.Collections.Generic;

namespace CineGo.Models;

public partial class Role
{
    public int RoleId { get; set; }

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public string? Permissions { get; set; }

    public virtual ICollection<Employee> Employees { get; set; } = new List<Employee>();
}
