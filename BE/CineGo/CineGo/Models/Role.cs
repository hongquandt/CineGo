using System;
using System.Collections.Generic;

namespace CineGo.Models;

public partial class Role
{
    public int RoleId { get; set; }

    public string Name { get; set; } = null!;

    public string? Permissions { get; set; }
}
