using System;
using System.Collections.Generic;

namespace CineGo.Models;

public partial class OrderItem
{
    public int OrderItemId { get; set; }

    public int BookingId { get; set; }

    public int ProductId { get; set; }

    public string ItemType { get; set; } = null!;

    public int Quantity { get; set; }

    public decimal UnitPrice { get; set; }

    public decimal SubTotal { get; set; }

    public string? Notes { get; set; }

    public virtual Booking Booking { get; set; } = null!;

    public virtual Product Product { get; set; } = null!;
}
