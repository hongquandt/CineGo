using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace CineGo.Models;

public partial class CinemaDbContext : DbContext
{
    public CinemaDbContext()
    {
    }

    public CinemaDbContext(DbContextOptions<CinemaDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Auditorium> Auditoria { get; set; }

    public virtual DbSet<Booking> Bookings { get; set; }

    public virtual DbSet<Cinema> Cinemas { get; set; }

    public virtual DbSet<Customer> Customers { get; set; }

    public virtual DbSet<Genre> Genres { get; set; }

    public virtual DbSet<Member> Members { get; set; }

    public virtual DbSet<Movie> Movies { get; set; }

    public virtual DbSet<MovieCast> MovieCasts { get; set; }

    public virtual DbSet<MovieGenre> MovieGenres { get; set; }

    public virtual DbSet<OrderItem> OrderItems { get; set; }

    public virtual DbSet<Payment> Payments { get; set; }

    public virtual DbSet<Person> People { get; set; }

    public virtual DbSet<PriceAssignment> PriceAssignments { get; set; }

    public virtual DbSet<PriceCategory> PriceCategories { get; set; }

    public virtual DbSet<Product> Products { get; set; }

    public virtual DbSet<Promotion> Promotions { get; set; }

    public virtual DbSet<PromotionAssignment> PromotionAssignments { get; set; }

    public virtual DbSet<PromotionUsage> PromotionUsages { get; set; }

    public virtual DbSet<Review> Reviews { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<Employee> Employees { get; set; }

    public virtual DbSet<ScreenType> ScreenTypes { get; set; }

    public virtual DbSet<Screening> Screenings { get; set; }

    public virtual DbSet<Seat> Seats { get; set; }

    public virtual DbSet<SeatReservation> SeatReservations { get; set; }

    public virtual DbSet<SeatType> SeatTypes { get; set; }

    public virtual DbSet<Ticket> Tickets { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        var configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json")
            .Build();

        var connectionString = configuration.GetConnectionString("DBDefault");

        optionsBuilder.UseSqlServer(connectionString);
    }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Auditorium>(entity =>
        {
            entity.HasKey(e => e.AuditoriumId).HasName("PK__Auditori__6E91B1A53070B288");

            entity.ToTable("Auditorium");

            entity.HasIndex(e => e.CinemaId, "IX_Auditorium_CinemaID");

            entity.Property(e => e.AuditoriumId).HasColumnName("AuditoriumID");
            entity.Property(e => e.CinemaId).HasColumnName("CinemaID");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.ScreenTypeId).HasColumnName("ScreenTypeID");

            entity.HasOne(d => d.Cinema).WithMany(p => p.Auditoria)
                .HasForeignKey(d => d.CinemaId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Auditorium_Cinema");

            entity.HasOne(d => d.ScreenType).WithMany(p => p.Auditoria)
                .HasForeignKey(d => d.ScreenTypeId)
                .HasConstraintName("FK_Auditorium_ScreenType");
        });

        modelBuilder.Entity<Booking>(entity =>
        {
            entity.HasKey(e => e.BookingId).HasName("PK__Booking__73951ACDDCB031D9");

            entity.ToTable("Booking");

            entity.HasIndex(e => new { e.CreatedAt, e.Status }, "IX_Booking_CreatedAt_Status");

            entity.HasIndex(e => e.MemberId, "IX_Booking_MemberID");

            entity.HasIndex(e => e.Status, "IX_Booking_Status");

            entity.HasIndex(e => e.BookingReference, "UX_Booking_Reference")
                .IsUnique()
                .HasFilter("([BookingReference] IS NOT NULL)");

            entity.Property(e => e.BookingId).HasColumnName("BookingID");
            entity.Property(e => e.MemberId).HasColumnName("MemberID");
            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .HasDefaultValue("Pending");
            entity.Property(e => e.TotalAmount).HasColumnType("decimal(12, 2)").HasDefaultValue(0.00m);
            entity.Property(e => e.BookingReference).HasMaxLength(50);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysutcdatetime())");

            entity.HasOne(d => d.Member).WithMany(p => p.Bookings)
                .HasForeignKey(d => d.MemberId)
                .HasConstraintName("FK_Booking_Member");
        });

        modelBuilder.Entity<Cinema>(entity =>
        {
            entity.HasKey(e => e.CinemaId).HasName("PK__Cinema__59C9262665EF68BC");

            entity.ToTable("Cinema");

            entity.Property(e => e.CinemaId).HasColumnName("CinemaID");
            entity.Property(e => e.Name).HasMaxLength(200).IsRequired();
            entity.Property(e => e.Address).HasMaxLength(400).IsRequired();
            entity.Property(e => e.City).HasMaxLength(100).IsRequired();
            entity.Property(e => e.StateProvince).HasMaxLength(100);
            entity.Property(e => e.PostalCode).HasMaxLength(20);
            entity.Property(e => e.Country).HasMaxLength(100).HasDefaultValue("Vietnam");
            entity.Property(e => e.Phone).HasMaxLength(50);
            entity.Property(e => e.Email).HasMaxLength(200);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
        });

        modelBuilder.Entity<Customer>(entity =>
        {
            entity.HasKey(e => e.CustomerId).HasName("PK__Customer__A4AE64B8FE0F5D8F");

            entity.ToTable("Customer");

            entity.HasIndex(e => e.Email, "UX_Customer_Email")
                .IsUnique()
                .HasFilter("([Email] IS NOT NULL)");

            entity.HasIndex(e => e.Phone, "UX_Customer_Phone")
                .IsUnique()
                .HasFilter("([Phone] IS NOT NULL)");

            entity.Property(e => e.CustomerId).HasColumnName("CustomerID");
            entity.Property(e => e.Email).HasMaxLength(200);
            entity.Property(e => e.FullName).HasMaxLength(200).IsRequired();
            entity.Property(e => e.Phone).HasMaxLength(50);
            entity.Property(e => e.Address).HasMaxLength(400);
            entity.Property(e => e.City).HasMaxLength(100);
            entity.Property(e => e.Gender).HasMaxLength(20);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.IsMember).HasDefaultValue(false);
        });

        modelBuilder.Entity<Genre>(entity =>
        {
            entity.HasKey(e => e.GenreId).HasName("PK__Genre__0385055E457B16DE");

            entity.ToTable("Genre");

            entity.HasIndex(e => e.Name, "UQ__Genre__737584F643858B22").IsUnique();

            entity.Property(e => e.GenreId).HasColumnName("GenreID");
            entity.Property(e => e.Name).HasMaxLength(100).IsRequired();
            entity.Property(e => e.Description).HasMaxLength(400);
        });

        modelBuilder.Entity<Member>(entity =>
        {
            entity.HasKey(e => e.MemberId).HasName("PK__Member__0CF04B3866D48E8D");

            entity.ToTable("Member");

            entity.HasIndex(e => e.Username, "UQ__Member__536C85E4530D169E").IsUnique();

            entity.HasIndex(e => e.CustomerId, "UQ__Member__A4AE64B9D679F364").IsUnique();

            entity.Property(e => e.MemberId).HasColumnName("MemberID");
            entity.Property(e => e.CustomerId).HasColumnName("CustomerID");
            entity.Property(e => e.MembershipLevel).HasMaxLength(100).HasDefaultValue("Basic");
            entity.Property(e => e.PasswordHash).HasMaxLength(500).IsRequired();
            entity.Property(e => e.Username).HasMaxLength(150).IsRequired();
            entity.Property(e => e.Points).HasDefaultValue(0);
            entity.Property(e => e.JoinDate).HasDefaultValueSql("(sysutcdatetime())");

            entity.HasOne(d => d.Customer).WithOne(p => p.Member)
                .HasForeignKey<Member>(d => d.CustomerId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_Member_Customer");
        });

        modelBuilder.Entity<Movie>(entity =>
        {
            entity.HasKey(e => e.MovieId).HasName("PK__Movie__4BD2943A1A7DF10E");

            entity.ToTable("Movie");

            entity.Property(e => e.MovieId).HasColumnName("MovieID");
            entity.Property(e => e.Title).HasMaxLength(300).IsRequired();
            entity.Property(e => e.Country).HasMaxLength(100);
            entity.Property(e => e.Language).HasMaxLength(50);
            entity.Property(e => e.Rating).HasMaxLength(50);
            entity.Property(e => e.PosterURL).HasMaxLength(500);
            entity.Property(e => e.TrailerURL).HasMaxLength(500);
            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .HasDefaultValue("ComingSoon");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
        });

        modelBuilder.Entity<MovieCast>(entity =>
        {
            entity.HasKey(e => new { e.MovieId, e.PersonId });

            entity.ToTable("MovieCast");

            entity.Property(e => e.MovieId).HasColumnName("MovieID");
            entity.Property(e => e.PersonId).HasColumnName("PersonID");
            entity.Property(e => e.CharacterName).HasMaxLength(200);

            entity.HasOne(d => d.Movie).WithMany(p => p.MovieCasts)
                .HasForeignKey(d => d.MovieId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_MovieCast_Movie");

            entity.HasOne(d => d.Person).WithMany(p => p.MovieCasts)
                .HasForeignKey(d => d.PersonId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_MovieCast_Person");
        });

        modelBuilder.Entity<MovieGenre>(entity =>
        {
            entity.HasKey(e => new { e.MovieId, e.GenreId })
                .HasName("PK_MovieGenre");

            entity.ToTable("MovieGenre");

            entity.Property(e => e.MovieId).HasColumnName("MovieID");
            entity.Property(e => e.GenreId).HasColumnName("GenreID");

            entity.HasOne(d => d.Movie).WithMany(p => p.MovieGenres)
                .HasForeignKey(d => d.MovieId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_MovieGenre_Movie");

            entity.HasOne(d => d.Genre).WithMany(p => p.MovieGenres)
                .HasForeignKey(d => d.GenreId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_MovieGenre_Genre");
        });

        modelBuilder.Entity<OrderItem>(entity =>
        {
            entity.HasKey(e => e.OrderItemId).HasName("PK__OrderIte__57ED06A1A35091AF");

            entity.ToTable("OrderItem");

            entity.Property(e => e.OrderItemId).HasColumnName("OrderItemID");
            entity.Property(e => e.BookingId).HasColumnName("BookingID");
            entity.Property(e => e.ProductId).HasColumnName("ProductID");
            entity.Property(e => e.ItemType).HasMaxLength(50).HasDefaultValue("Concession");
            entity.Property(e => e.Quantity).HasDefaultValue(1);
            entity.Property(e => e.UnitPrice).HasColumnType("decimal(12, 2)");
            entity.Property(e => e.SubTotal).HasColumnType("decimal(12, 2)").HasComputedColumnSql("([Quantity] * [UnitPrice])", stored: true);
            entity.Property(e => e.Notes).HasMaxLength(200);

            entity.HasOne(d => d.Booking).WithMany(p => p.OrderItems)
                .HasForeignKey(d => d.BookingId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_OrderItem_Booking");

            entity.HasOne(d => d.Product).WithMany(p => p.OrderItems)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_OrderItem_Product");
        });

        modelBuilder.Entity<Payment>(entity =>
        {
            entity.HasKey(e => e.PaymentId).HasName("PK__Payment__9B556A5813CF6496");

            entity.ToTable("Payment");

            entity.HasIndex(e => e.BookingId, "IX_Payment_BookingID");
            entity.HasIndex(e => e.Status, "IX_Payment_Status");

            entity.Property(e => e.PaymentId).HasColumnName("PaymentID");
            entity.Property(e => e.BookingId).HasColumnName("BookingID");
            entity.Property(e => e.Amount).HasColumnType("decimal(12, 2)");
            entity.Property(e => e.Method).HasMaxLength(50).IsRequired();
            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .HasDefaultValue("Pending");
            entity.Property(e => e.TransactionID).HasMaxLength(100);

            entity.HasOne(d => d.Booking).WithMany(p => p.Payments)
                .HasForeignKey(d => d.BookingId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_Payment_Booking");
        });

        modelBuilder.Entity<Person>(entity =>
        {
            entity.HasKey(e => e.PersonId).HasName("PK__Person__AA2FFB857B39FC0F");

            entity.ToTable("Person");

            entity.Property(e => e.PersonId).HasColumnName("PersonID");
            entity.Property(e => e.Dob).HasColumnName("DOB");
            entity.Property(e => e.FullName).HasMaxLength(200);
            entity.Property(e => e.RoleType).HasMaxLength(50);
        });

        modelBuilder.Entity<PriceAssignment>(entity =>
        {
            entity.HasKey(e => e.PriceAssignmentId).HasName("PK__PriceAss__EDD54714CF506C94");

            entity.ToTable("PriceAssignment");

            entity.HasIndex(e => e.PriceCategoryId, "IX_PriceAssignment_PriceCategory");

            entity.Property(e => e.PriceAssignmentId).HasColumnName("PriceAssignmentID");
            entity.Property(e => e.AuditoriumId).HasColumnName("AuditoriumID");
            entity.Property(e => e.ConditionDescription).HasMaxLength(500);
            entity.Property(e => e.Multiplier)
                .HasDefaultValue(1.0000m)
                .HasColumnType("decimal(6, 4)");
            entity.Property(e => e.PriceCategoryId).HasColumnName("PriceCategoryID");
            entity.Property(e => e.SeatTypeId).HasColumnName("SeatTypeID");

            entity.HasOne(d => d.Auditorium).WithMany(p => p.PriceAssignments)
                .HasForeignKey(d => d.AuditoriumId)
                .HasConstraintName("FK_PriceAssignment_Auditorium");

            entity.HasOne(d => d.PriceCategory).WithMany(p => p.PriceAssignments)
                .HasForeignKey(d => d.PriceCategoryId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PriceAssignment_PriceCategory");

            entity.HasOne(d => d.SeatType).WithMany(p => p.PriceAssignments)
                .HasForeignKey(d => d.SeatTypeId)
                .HasConstraintName("FK_PriceAssignment_SeatType");
        });

        modelBuilder.Entity<PriceCategory>(entity =>
        {
            entity.HasKey(e => e.PriceCategoryId).HasName("PK__PriceCat__68DAA1827AB1C282");

            entity.ToTable("PriceCategory");

            entity.Property(e => e.PriceCategoryId).HasColumnName("PriceCategoryID");
            entity.Property(e => e.Name).HasMaxLength(100).IsRequired();
            entity.Property(e => e.Description).HasMaxLength(400);
            entity.Property(e => e.BasePrice).HasColumnType("decimal(10, 2)").IsRequired();
            entity.Property(e => e.IsActive).HasDefaultValue(true);
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.ProductId).HasName("PK__Product__B40CC6ED1AE26084");

            entity.ToTable("Product");

            entity.Property(e => e.ProductId).HasColumnName("ProductID");
            entity.Property(e => e.Name).HasMaxLength(200).IsRequired();
            entity.Property(e => e.Category).HasMaxLength(100);
            entity.Property(e => e.IsAvailable).HasDefaultValue(true);
            entity.Property(e => e.Price).HasColumnType("decimal(12, 2)");
        });

        modelBuilder.Entity<Promotion>(entity =>
        {
            entity.HasKey(e => e.PromotionId).HasName("PK__Promotio__52C42F2F088393A9");

            entity.ToTable("Promotion");

            entity.HasIndex(e => e.Code, "UX_Promotion_Code")
                .IsUnique()
                .HasFilter("([Code] IS NOT NULL)");

            entity.Property(e => e.PromotionId).HasColumnName("PromotionID");
            entity.Property(e => e.Code).HasMaxLength(100);
            entity.Property(e => e.Description).HasMaxLength(400);
            entity.Property(e => e.DiscountType).HasMaxLength(20).IsRequired().HasDefaultValue("Percentage");
            entity.Property(e => e.DiscountValue).HasColumnType("decimal(12, 2)");
            entity.Property(e => e.UsageCount).HasDefaultValue(0);
            entity.Property(e => e.AppliesTo).HasMaxLength(50).HasDefaultValue("Ticket");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
        });

        modelBuilder.Entity<PromotionAssignment>(entity =>
        {
            entity.HasKey(e => e.PromotionAssignmentId).HasName("PK__Promotio__7DE6D1AEC4BEB2E8");

            entity.ToTable("PromotionAssignment");

            entity.HasIndex(e => e.PromotionId, "IX_PromotionAssignment_PromotionID");

            entity.Property(e => e.PromotionAssignmentId).HasColumnName("PromotionAssignmentID");
            entity.Property(e => e.CinemaId).HasColumnName("CinemaID");
            entity.Property(e => e.MovieId).HasColumnName("MovieID");
            entity.Property(e => e.PromotionId).HasColumnName("PromotionID");
            entity.Property(e => e.ScreeningId).HasColumnName("ScreeningID");

            entity.HasOne(d => d.Cinema).WithMany(p => p.PromotionAssignments)
                .HasForeignKey(d => d.CinemaId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PromotionAssignment_Cinema");

            entity.HasOne(d => d.Movie).WithMany(p => p.PromotionAssignments)
                .HasForeignKey(d => d.MovieId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PromotionAssignment_Movie");

            entity.HasOne(d => d.Promotion).WithMany(p => p.PromotionAssignments)
                .HasForeignKey(d => d.PromotionId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PromotionAssignment_Promotion");

            entity.HasOne(d => d.Screening).WithMany(p => p.PromotionAssignments)
                .HasForeignKey(d => d.ScreeningId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PromotionAssignment_Screening");
        });

        modelBuilder.Entity<PromotionUsage>(entity =>
        {
            entity.HasKey(e => e.UsageId).HasName("PK_PromotionUsage");

            entity.ToTable("PromotionUsage");

            entity.HasIndex(e => new { e.PromotionId, e.BookingId }, "UX_PromotionUsage_Promotion_Booking").IsUnique();

            entity.Property(e => e.UsageId).HasColumnName("UsageID");
            entity.Property(e => e.PromotionId).HasColumnName("PromotionID");
            entity.Property(e => e.BookingId).HasColumnName("BookingID");
            entity.Property(e => e.DiscountApplied).HasColumnType("decimal(12, 2)");
            entity.Property(e => e.UsedAt).HasDefaultValueSql("(sysutcdatetime())");

            entity.HasOne(d => d.Promotion).WithMany(p => p.PromotionUsages)
                .HasForeignKey(d => d.PromotionId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PromotionUsage_Promotion");

            entity.HasOne(d => d.Booking).WithMany(p => p.PromotionUsages)
                .HasForeignKey(d => d.BookingId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_PromotionUsage_Booking");
        });

        modelBuilder.Entity<Review>(entity =>
        {
            entity.HasKey(e => e.ReviewId).HasName("PK__Review__74BC79AE9033199D");

            entity.ToTable("Review");

            entity.HasIndex(e => e.MovieId, "IX_Review_MovieID");
            entity.HasIndex(e => e.MemberId, "IX_Review_MemberID");

            entity.Property(e => e.ReviewId).HasColumnName("ReviewID");
            entity.Property(e => e.CustomerId).HasColumnName("CustomerID");
            entity.Property(e => e.MemberId).HasColumnName("MemberID");
            entity.Property(e => e.MovieId).HasColumnName("MovieID");
            entity.Property(e => e.Title).HasMaxLength(200);
            entity.Property(e => e.PostedAt).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.IsApproved).HasDefaultValue(false);

            entity.HasOne(d => d.Customer).WithMany(p => p.Reviews)
                .HasForeignKey(d => d.CustomerId)
                .HasConstraintName("FK_Review_Customer");

            entity.HasOne(d => d.Member).WithMany(p => p.Reviews)
                .HasForeignKey(d => d.MemberId)
                .HasConstraintName("FK_Review_Member");

            entity.HasOne(d => d.Movie).WithMany(p => p.Reviews)
                .HasForeignKey(d => d.MovieId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Review_Movie");
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.RoleId).HasName("PK__Role__8AFACE3ACB94AD4F");

            entity.ToTable("Role");

            entity.HasIndex(e => e.Name, "UQ__Role__737584F643858B22").IsUnique();

            entity.Property(e => e.RoleId).HasColumnName("RoleID");
            entity.Property(e => e.Name).HasMaxLength(100).IsRequired();
            entity.Property(e => e.Description).HasMaxLength(400);
        });

        modelBuilder.Entity<Employee>(entity =>
        {
            entity.HasKey(e => e.EmployeeId).HasName("PK_Employee");

            entity.ToTable("Employee");

            entity.HasIndex(e => e.Email, "UX_Employee_Email")
                .IsUnique()
                .HasFilter("([Email] IS NOT NULL)");

            entity.Property(e => e.EmployeeId).HasColumnName("EmployeeID");
            entity.Property(e => e.CinemaId).HasColumnName("CinemaID");
            entity.Property(e => e.FullName).HasMaxLength(200).IsRequired();
            entity.Property(e => e.Email).HasMaxLength(200);
            entity.Property(e => e.Phone).HasMaxLength(50);
            entity.Property(e => e.RoleId).HasColumnName("RoleID");
            entity.Property(e => e.HireDate).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysutcdatetime())");

            entity.HasOne(d => d.Cinema).WithMany(p => p.Employees)
                .HasForeignKey(d => d.CinemaId)
                .HasConstraintName("FK_Employee_Cinema");

            entity.HasOne(d => d.Role).WithMany(p => p.Employees)
                .HasForeignKey(d => d.RoleId)
                .HasConstraintName("FK_Employee_Role");
        });

        modelBuilder.Entity<ScreenType>(entity =>
        {
            entity.HasKey(e => e.ScreenTypeId).HasName("PK__ScreenTy__609EFF6CBA9C5E67");

            entity.ToTable("ScreenType");

            entity.Property(e => e.ScreenTypeId).HasColumnName("ScreenTypeID");
            entity.Property(e => e.Description).HasMaxLength(400);
            entity.Property(e => e.Name).HasMaxLength(100);
        });

        modelBuilder.Entity<Screening>(entity =>
        {
            entity.HasKey(e => e.ScreeningId).HasName("PK__Screenin__7734E46CECAF4B99");

            entity.ToTable("Screening");

            entity.HasIndex(e => e.AuditoriumId, "IX_Screening_AuditoriumID");
            entity.HasIndex(e => e.StartAt, "IX_Screening_StartAt");
            entity.HasIndex(e => e.MovieId, "IX_Screening_MovieID");
            entity.HasIndex(e => new { e.AuditoriumId, e.StartAt }, "IX_Screening_Auditorium_StartAt");

            entity.Property(e => e.ScreeningId).HasColumnName("ScreeningID");
            entity.Property(e => e.MovieId).HasColumnName("MovieID");
            entity.Property(e => e.AuditoriumId).HasColumnName("AuditoriumID");
            entity.Property(e => e.Language).HasMaxLength(50);
            entity.Property(e => e.Subtitles).HasMaxLength(50);
            entity.Property(e => e.Status)
                .HasMaxLength(30)
                .HasDefaultValue("Scheduled");
            entity.Property(e => e.PriceCategoryId).HasColumnName("PriceCategoryID");
            entity.Property(e => e.Is3D).HasDefaultValue(false);

            entity.HasOne(d => d.Movie).WithMany(p => p.Screenings)
                .HasForeignKey(d => d.MovieId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Screening_Movie");

            entity.HasOne(d => d.Auditorium).WithMany(p => p.Screenings)
                .HasForeignKey(d => d.AuditoriumId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Screening_Auditorium");

            entity.HasOne(d => d.PriceCategory).WithMany(p => p.Screenings)
                .HasForeignKey(d => d.PriceCategoryId)
                .HasConstraintName("FK_Screening_PriceCategory");
        });

        modelBuilder.Entity<Seat>(entity =>
        {
            entity.HasKey(e => e.SeatId).HasName("PK__Seat__311713D3274783AF");

            entity.ToTable("Seat");

            entity.HasIndex(e => e.AuditoriumId, "IX_Seat_AuditoriumID");

            entity.HasIndex(e => new { e.AuditoriumId, e.Row, e.Number }, "UX_Seat_Auditorium_Row_Number").IsUnique();

            entity.Property(e => e.SeatId).HasColumnName("SeatID");
            entity.Property(e => e.AuditoriumId).HasColumnName("AuditoriumID");
            entity.Property(e => e.Row).HasMaxLength(10).IsRequired();
            entity.Property(e => e.Number).IsRequired();
            entity.Property(e => e.Label).HasMaxLength(50).IsRequired().IsUnicode(false);
            entity.Property(e => e.SeatTypeId).HasColumnName("SeatTypeID");
            entity.Property(e => e.Section).HasMaxLength(20);
            entity.Property(e => e.IsAvailable).HasDefaultValue(true);
            entity.Property(e => e.IsAccessible).HasDefaultValue(false);

            entity.HasOne(d => d.Auditorium).WithMany(p => p.Seats)
                .HasForeignKey(d => d.AuditoriumId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Seat_Auditorium");

            entity.HasOne(d => d.SeatType).WithMany(p => p.Seats)
                .HasForeignKey(d => d.SeatTypeId)
                .HasConstraintName("FK_Seat_SeatType");
        });

        modelBuilder.Entity<SeatReservation>(entity =>
        {
            entity.HasKey(e => e.ReservationId).HasName("PK__SeatRese__B7EE5F04C43EF6A4");

            entity.ToTable("SeatReservation");

            entity.HasIndex(e => new { e.ScreeningId, e.ReservedUntil }, "IX_SeatReservation_Screening_ReservedUntil");

            entity.HasIndex(e => new { e.ScreeningId, e.SeatId }, "UX_SeatReservation_Screening_Seat")
                .IsUnique()
                .HasFilter("([Status] IN ('Held', 'Confirmed'))");

            entity.Property(e => e.ReservationId).HasColumnName("ReservationID");
            entity.Property(e => e.ScreeningId).HasColumnName("ScreeningID");
            entity.Property(e => e.SeatId).HasColumnName("SeatID");
            entity.Property(e => e.BookingId).HasColumnName("BookingID");
            entity.Property(e => e.ReservedUntil).IsRequired();
            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .HasDefaultValue("Held");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysutcdatetime())");

            entity.HasOne(d => d.Screening).WithMany(p => p.SeatReservations)
                .HasForeignKey(d => d.ScreeningId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SeatReservation_Screening");

            entity.HasOne(d => d.Seat).WithMany(p => p.SeatReservations)
                .HasForeignKey(d => d.SeatId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SeatReservation_Seat");

            entity.HasOne(d => d.Booking).WithMany(p => p.SeatReservations)
                .HasForeignKey(d => d.BookingId)
                .HasConstraintName("FK_SeatReservation_Booking");
        });

        modelBuilder.Entity<SeatType>(entity =>
        {
            entity.HasKey(e => e.SeatTypeId).HasName("PK__SeatType__7468C4DE40F26487");

            entity.ToTable("SeatType");

            entity.Property(e => e.SeatTypeId).HasColumnName("SeatTypeID");
            entity.Property(e => e.Description).HasMaxLength(400);
            entity.Property(e => e.Name).HasMaxLength(100);
        });

        modelBuilder.Entity<Ticket>(entity =>
        {
            entity.HasKey(e => e.TicketId).HasName("PK__Ticket__712CC6278D4248A6");

            entity.ToTable("Ticket");

            entity.HasIndex(e => e.BookingId, "IX_Ticket_BookingID");
            entity.HasIndex(e => e.ScreeningId, "IX_Ticket_ScreeningID");
            entity.HasIndex(e => e.Status, "IX_Ticket_Status");
            entity.HasIndex(e => e.Barcode, "UX_Ticket_Barcode")
                .IsUnique()
                .HasFilter("([Barcode] IS NOT NULL)");

            entity.Property(e => e.TicketId).HasColumnName("TicketID");
            entity.Property(e => e.BookingId).HasColumnName("BookingID");
            entity.Property(e => e.ScreeningId).HasColumnName("ScreeningID");
            entity.Property(e => e.SeatId).HasColumnName("SeatID");
            entity.Property(e => e.Price).HasColumnType("decimal(12, 2)");
            entity.Property(e => e.TicketType).HasMaxLength(50);
            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .HasDefaultValue("Booked");
            entity.Property(e => e.Barcode).HasMaxLength(50);
            entity.Property(e => e.SeatLabel).HasMaxLength(20);
            entity.Property(e => e.IssuedAt).HasDefaultValueSql("(sysutcdatetime())");

            entity.HasOne(d => d.Booking).WithMany(p => p.Tickets)
                .HasForeignKey(d => d.BookingId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_Ticket_Booking");

            entity.HasOne(d => d.Screening).WithMany(p => p.Tickets)
                .HasForeignKey(d => d.ScreeningId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Ticket_Screening");

            entity.HasOne(d => d.Seat).WithMany(p => p.Tickets)
                .HasForeignKey(d => d.SeatId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Ticket_Seat");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
