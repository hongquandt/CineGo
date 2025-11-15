using System;
using System.Collections.Generic;

namespace CineGo.Models;

public partial class ScreenType
{
    public int ScreenTypeId { get; set; }

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public virtual ICollection<Auditorium> Auditoria { get; set; } = new List<Auditorium>();
}
