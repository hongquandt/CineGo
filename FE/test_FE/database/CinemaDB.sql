IF DB_ID(N'CinemaDB') IS NULL
BEGIN
    CREATE DATABASE CinemaDB
    CONTAINMENT = NONE;
END
GO
USE CinemaDB;
GO
SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
GO
-- ScreenType
CREATE TABLE dbo.ScreenType (
    ScreenTypeID INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Description NVARCHAR(400) NULL
);
GO
-- SeatType
CREATE TABLE dbo.SeatType (
    SeatTypeID INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Description NVARCHAR(400) NULL
);
GO
-- PriceCategory (base price definitions)
CREATE TABLE dbo.PriceCategory (
    PriceCategoryID INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Description NVARCHAR(400) NULL,
    BasePrice DECIMAL(10,2) NOT NULL,
    IsActive BIT NOT NULL DEFAULT(1)
);
GO
/* ===================================================
   3. Main business entities
   =================================================== */
-- Cinema (chain / physical location)
CREATE TABLE dbo.Cinema (
    CinemaID INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(200) NOT NULL,
    Address NVARCHAR(400) NOT NULL,
    City NVARCHAR(100) NOT NULL,
    StateProvince NVARCHAR(100) NULL,
    PostalCode NVARCHAR(20) NULL,
    Country NVARCHAR(100) DEFAULT('Vietnam'),
    Phone NVARCHAR(50) NULL,
    Email NVARCHAR(200) NULL,
    IsActive BIT NOT NULL DEFAULT(1)
);
GO
-- Auditorium (Hall)
CREATE TABLE dbo.Auditorium (
    AuditoriumID INT IDENTITY(1,1) PRIMARY KEY,
    CinemaID INT NOT NULL,
    Name NVARCHAR(100) NOT NULL,
    ScreenTypeID INT NULL,
    Capacity INT NOT NULL DEFAULT(0) CHECK (Capacity > 0),
    IsActive BIT NOT NULL DEFAULT(1),
    CONSTRAINT FK_Auditorium_Cinema FOREIGN KEY (CinemaID) REFERENCES dbo.Cinema(CinemaID),
    CONSTRAINT FK_Auditorium_ScreenType FOREIGN KEY (ScreenTypeID) REFERENCES dbo.ScreenType(ScreenTypeID)
);
CREATE INDEX IX_Auditorium_CinemaID ON dbo.Auditorium(CinemaID);
GO
-- Seat (in Auditorium)
CREATE TABLE dbo.Seat (
    SeatID INT IDENTITY(1,1) PRIMARY KEY,
    AuditoriumID INT NOT NULL,
    [Row] NVARCHAR(10) NOT NULL,
    [Number] INT NOT NULL CHECK ([Number] > 0),
    Label VARCHAR(50) NOT NULL,
    SeatTypeID INT NULL,
    Section NVARCHAR(20) NULL, -- e.g., 'Center', 'Side' for better seating layout
    IsAvailable BIT NOT NULL DEFAULT(1),
    IsAccessible BIT NOT NULL DEFAULT(0), -- for wheelchair, etc.
    CONSTRAINT FK_Seat_Auditorium FOREIGN KEY (AuditoriumID) REFERENCES dbo.Auditorium(AuditoriumID),
    CONSTRAINT FK_Seat_SeatType FOREIGN KEY (SeatTypeID) REFERENCES dbo.SeatType(SeatTypeID)
);
CREATE UNIQUE INDEX UX_Seat_Auditorium_Row_Number ON dbo.Seat(AuditoriumID, [Row], [Number]);
CREATE INDEX IX_Seat_AuditoriumID ON dbo.Seat(AuditoriumID);
GO
-- Movie
CREATE TABLE dbo.Movie (
    MovieID INT IDENTITY(1,1) PRIMARY KEY,
    Title NVARCHAR(300) NOT NULL,
    Synopsis NVARCHAR(MAX) NULL,
    DurationMinutes INT NOT NULL CHECK (DurationMinutes > 0),
    Language NVARCHAR(50) NULL,
    ReleaseDate DATE NULL,
    Country NVARCHAR(100) NULL,
    Rating NVARCHAR(50) NULL, -- e.g., PG-13, 18+
    PosterURL NVARCHAR(500) NULL,
    TrailerURL NVARCHAR(500) NULL,
    Status NVARCHAR(50) NOT NULL DEFAULT('ComingSoon') CHECK (Status IN ('ComingSoon', 'NowShowing', 'Ended')),
    IsActive BIT NOT NULL DEFAULT(1)
);
GO
-- Genre (standalone for reusability)
CREATE TABLE dbo.Genre (
    GenreID INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL UNIQUE,
    Description NVARCHAR(400) NULL
);
GO
-- MovieGenre junction (many-to-many)
CREATE TABLE dbo.MovieGenre (
    MovieID INT NOT NULL,
    GenreID INT NOT NULL,
    CONSTRAINT PK_MovieGenre PRIMARY KEY (MovieID, GenreID),
    CONSTRAINT FK_MovieGenre_Movie FOREIGN KEY (MovieID) REFERENCES dbo.Movie(MovieID) ON DELETE CASCADE,
    CONSTRAINT FK_MovieGenre_Genre FOREIGN KEY (GenreID) REFERENCES dbo.Genre(GenreID) ON DELETE CASCADE
);
GO
-- Person (actors, directors)
CREATE TABLE dbo.Person (
    PersonID INT IDENTITY(1,1) PRIMARY KEY,
    FullName NVARCHAR(200) NOT NULL,
    DOB DATE NULL,
    Nationality NVARCHAR(100) NULL,
    RoleType NVARCHAR(50) NULL, -- e.g., Actor, Director, Producer
    PhotoURL NVARCHAR(500) NULL,
    IsActive BIT NOT NULL DEFAULT(1)
);
GO
-- MovieCast junction
CREATE TABLE dbo.MovieCast (
    MovieID INT NOT NULL,
    PersonID INT NOT NULL,
    CharacterName NVARCHAR(200) NULL,
    BillingOrder INT NULL CHECK (BillingOrder >= 0), -- for top-billed actors
    CONSTRAINT PK_MovieCast PRIMARY KEY (MovieID, PersonID),
    CONSTRAINT FK_MovieCast_Movie FOREIGN KEY (MovieID) REFERENCES dbo.Movie(MovieID) ON DELETE CASCADE,
    CONSTRAINT FK_MovieCast_Person FOREIGN KEY (PersonID) REFERENCES dbo.Person(PersonID) ON DELETE CASCADE
);
GO
-- Screening (Show)
CREATE TABLE dbo.Screening (
    ScreeningID INT IDENTITY(1,1) PRIMARY KEY,
    MovieID INT NOT NULL,
    AuditoriumID INT NOT NULL,
    StartAt DATETIME2 NOT NULL,
    EndAt DATETIME2 NOT NULL,
    Language NVARCHAR(50) NULL,
    Subtitles NVARCHAR(50) NULL, -- e.g., 'English', 'Vietnamese'
    Status NVARCHAR(30) NOT NULL DEFAULT('Scheduled') CHECK (Status IN ('Scheduled', 'Ongoing', 'Completed', 'Cancelled')),
    PriceCategoryID INT NULL, -- optional link to base pricing
    Is3D BIT NOT NULL DEFAULT(0),
    CONSTRAINT FK_Screening_Movie FOREIGN KEY (MovieID) REFERENCES dbo.Movie(MovieID),
    CONSTRAINT FK_Screening_Auditorium FOREIGN KEY (AuditoriumID) REFERENCES dbo.Auditorium(AuditoriumID),
    CONSTRAINT FK_Screening_PriceCategory FOREIGN KEY (PriceCategoryID) REFERENCES dbo.PriceCategory(PriceCategoryID),
    CONSTRAINT CK_Screening_EndAfterStart CHECK (EndAt > StartAt)
);
CREATE INDEX IX_Screening_StartAt ON dbo.Screening(StartAt);
CREATE INDEX IX_Screening_AuditoriumID ON dbo.Screening(AuditoriumID);
CREATE INDEX IX_Screening_MovieID ON dbo.Screening(MovieID);
GO
/* ===================================================
   4. Pricing rules (PriceAssignment)
   =================================================== */
-- PriceAssignment: rules to modify BasePrice (multiplier + fixed surcharge)
CREATE TABLE dbo.PriceAssignment (
    PriceAssignmentID INT IDENTITY(1,1) PRIMARY KEY,
    PriceCategoryID INT NOT NULL,
    AuditoriumID INT NULL,
    SeatTypeID INT NULL,
    StartDate DATETIME2 NULL,
    EndDate DATETIME2 NULL,
    Multiplier DECIMAL(6,4) NOT NULL DEFAULT(1.0000) CHECK (Multiplier >= 0),
    Surcharge DECIMAL(10,2) NOT NULL DEFAULT(0.00) CHECK (Surcharge >= 0),
    ConditionDescription NVARCHAR(500) NULL,
    IsActive BIT NOT NULL DEFAULT(1),
    CONSTRAINT FK_PriceAssignment_PriceCategory FOREIGN KEY (PriceCategoryID) REFERENCES dbo.PriceCategory(PriceCategoryID),
    CONSTRAINT FK_PriceAssignment_Auditorium FOREIGN KEY (AuditoriumID) REFERENCES dbo.Auditorium(AuditoriumID),
    CONSTRAINT FK_PriceAssignment_SeatType FOREIGN KEY (SeatTypeID) REFERENCES dbo.SeatType(SeatTypeID),
    CONSTRAINT CK_PriceAssignment_ValidDates CHECK ((StartDate IS NULL) OR (EndDate IS NULL) OR (EndDate >= StartDate))
);
CREATE INDEX IX_PriceAssignment_PriceCategory ON dbo.PriceAssignment(PriceCategoryID);
CREATE INDEX IX_PriceAssignment_StartDate ON dbo.PriceAssignment(StartDate);
GO
/* ===================================================
   5. Customers, Members, Employees, Roles
   =================================================== */
-- Customer
CREATE TABLE dbo.Customer (
    CustomerID INT IDENTITY(1,1) PRIMARY KEY,
    Email NVARCHAR(200) NULL,
    Phone NVARCHAR(50) NULL,
    FullName NVARCHAR(200) NOT NULL,
    Address NVARCHAR(400) NULL,
    City NVARCHAR(100) NULL,
    DateOfBirth DATE NULL,
    Gender NVARCHAR(20) NULL,
    IsMember BIT NOT NULL DEFAULT(0),
    CreatedAt DATETIME2 DEFAULT SYSUTCDATETIME(),
    IsActive BIT NOT NULL DEFAULT(1)
);
CREATE UNIQUE INDEX UX_Customer_Email ON dbo.Customer(Email) WHERE Email IS NOT NULL;
CREATE UNIQUE INDEX UX_Customer_Phone ON dbo.Customer(Phone) WHERE Phone IS NOT NULL;
GO
-- Member (account)
CREATE TABLE dbo.[Member] (
    MemberID INT IDENTITY(1,1) PRIMARY KEY,
    CustomerID INT NOT NULL UNIQUE,
    Username NVARCHAR(150) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(500) NOT NULL,
    Points INT NOT NULL DEFAULT(0) CHECK (Points >= 0),
    MembershipLevel NVARCHAR(100) NULL DEFAULT('Basic'), -- e.g., Basic, Silver, Gold
    JoinDate DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    LastLogin DATETIME2 NULL,
    CONSTRAINT FK_Member_Customer FOREIGN KEY (CustomerID) REFERENCES dbo.Customer(CustomerID) ON DELETE CASCADE
);
CREATE INDEX IX_Member_Level ON dbo.[Member](MembershipLevel);
GO
-- Role
CREATE TABLE dbo.[Role] (
    RoleID INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL UNIQUE,
    Description NVARCHAR(400) NULL,
    Permissions NVARCHAR(MAX) NULL -- JSON or delimited list of permissions
);
GO
-- Employee (uncommented and enhanced for realism)
CREATE TABLE dbo.Employee (
    EmployeeID INT IDENTITY(1,1) PRIMARY KEY,
    CinemaID INT NULL,
    FullName NVARCHAR(200) NOT NULL,
    Email NVARCHAR(200) NULL,
    Phone NVARCHAR(50) NULL,
    RoleID INT NULL,
    HireDate DATE NOT NULL DEFAULT GETDATE(),
    IsActive BIT NOT NULL DEFAULT(1),
    CreatedAt DATETIME2 DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2 NULL,
    CONSTRAINT FK_Employee_Cinema FOREIGN KEY (CinemaID) REFERENCES dbo.Cinema(CinemaID),
    CONSTRAINT FK_Employee_Role FOREIGN KEY (RoleID) REFERENCES dbo.[Role](RoleID)
);
CREATE UNIQUE INDEX UX_Employee_Email ON dbo.Employee(Email) WHERE Email IS NOT NULL;
GO
/* ===================================================
   6. Booking, SeatReservation, Ticket, Payment
   =================================================== */
-- Booking (Order)
CREATE TABLE dbo.Booking (
    BookingID INT IDENTITY(1,1) PRIMARY KEY,
    MemberID INT NULL, -- NULL for non-members
    Status NVARCHAR(50) NOT NULL DEFAULT('Pending') CHECK (Status IN ('Pending', 'Confirmed', 'Cancelled', 'Expired')),
    TotalAmount DECIMAL(12,2) NOT NULL DEFAULT(0.00) CHECK (TotalAmount >= 0),
    BookingReference NVARCHAR(50) NULL UNIQUE, -- e.g., 'BK-20251117-001'
    CreatedAt DATETIME2 DEFAULT SYSUTCDATETIME(),
    ExpiresAt DATETIME2 NULL,
    CONSTRAINT FK_Booking_Member FOREIGN KEY (MemberID) REFERENCES dbo.[Member](MemberID)
);
CREATE INDEX IX_Booking_MemberID ON dbo.Booking(MemberID);
CREATE INDEX IX_Booking_Status ON dbo.Booking(Status);
CREATE INDEX IX_Booking_CreatedAt_Status ON dbo.Booking(CreatedAt, Status);
GO
-- SeatReservation (hold)
CREATE TABLE dbo.SeatReservation (
    ReservationID INT IDENTITY(1,1) PRIMARY KEY,
    ScreeningID INT NOT NULL,
    SeatID INT NOT NULL,
    BookingID INT NULL,
    ReservedUntil DATETIME2 NOT NULL,
    Status NVARCHAR(50) NOT NULL DEFAULT('Held') CHECK (Status IN ('Held', 'Released', 'Confirmed')),
    CreatedAt DATETIME2 DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_SeatReservation_Screening FOREIGN KEY (ScreeningID) REFERENCES dbo.Screening(ScreeningID),
    CONSTRAINT FK_SeatReservation_Seat FOREIGN KEY (SeatID) REFERENCES dbo.Seat(SeatID),
    CONSTRAINT FK_SeatReservation_Booking FOREIGN KEY (BookingID) REFERENCES dbo.Booking(BookingID)
);
CREATE UNIQUE INDEX UX_SeatReservation_Screening_Seat ON dbo.SeatReservation(ScreeningID, SeatID) 
WHERE Status IN ('Held','Confirmed');
CREATE INDEX IX_SeatReservation_Screening_ReservedUntil ON dbo.SeatReservation(ScreeningID, ReservedUntil);
GO
-- Ticket
CREATE TABLE dbo.Ticket (
    TicketID INT IDENTITY(1,1) PRIMARY KEY,
    BookingID INT NOT NULL,
    ScreeningID INT NOT NULL,
    SeatID INT NOT NULL,
    Price DECIMAL(12,2) NOT NULL CHECK (Price >= 0),
    TicketType NVARCHAR(50) NULL, -- Adult, Child, Senior, Student
    Status NVARCHAR(50) NOT NULL DEFAULT('Booked') CHECK (Status IN ('Booked', 'CheckedIn', 'Cancelled', 'Refunded')),
    Barcode NVARCHAR(50) NULL UNIQUE, -- QR code or barcode value
    SeatLabel NVARCHAR(20) NULL, -- Denormalized for quick print
    IssuedAt DATETIME2 DEFAULT SYSUTCDATETIME(),
    CheckedInAt DATETIME2 NULL,
    CONSTRAINT FK_Ticket_Booking FOREIGN KEY (BookingID) REFERENCES dbo.Booking(BookingID) ON DELETE CASCADE,
    CONSTRAINT FK_Ticket_Screening FOREIGN KEY (ScreeningID) REFERENCES dbo.Screening(ScreeningID),
    CONSTRAINT FK_Ticket_Seat FOREIGN KEY (SeatID) REFERENCES dbo.Seat(SeatID)
);
CREATE INDEX IX_Ticket_BookingID ON dbo.Ticket(BookingID);
CREATE INDEX IX_Ticket_ScreeningID ON dbo.Ticket(ScreeningID);
CREATE INDEX IX_Ticket_Status ON dbo.Ticket(Status);
GO
-- Payment
CREATE TABLE dbo.Payment (
    PaymentID INT IDENTITY(1,1) PRIMARY KEY,
    BookingID INT NOT NULL,
    Amount DECIMAL(12,2) NOT NULL CHECK (Amount >= 0),
    Method NVARCHAR(50) NOT NULL, -- Card, Cash, EWallet, BankTransfer
    Status NVARCHAR(50) NOT NULL DEFAULT('Pending') CHECK (Status IN ('Pending', 'Completed', 'Failed', 'Refunded')),
    TransactionID NVARCHAR(100) NULL, -- External gateway ID
    PaidAt DATETIME2 NULL,
    RefundedAt DATETIME2 NULL,
    CONSTRAINT FK_Payment_Booking FOREIGN KEY (BookingID) REFERENCES dbo.Booking(BookingID) ON DELETE CASCADE
);
CREATE INDEX IX_Payment_BookingID ON dbo.Payment(BookingID);
CREATE INDEX IX_Payment_Status ON dbo.Payment(Status);
GO
/* ===================================================
   7. Product (POS) tables for concessions
   =================================================== */
-- Product item
CREATE TABLE dbo.Product (
    ProductID INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(200) NOT NULL,
    Price DECIMAL(12,2) NOT NULL CHECK (Price >= 0),
    Category NVARCHAR(100) NULL, -- Popcorn, Drinks, Combo
    IsAvailable BIT NOT NULL DEFAULT(1),
    StockQuantity INT NULL CHECK (StockQuantity >= 0) -- for inventory
);
GO
-- OrderItem (concessions tied to booking)
CREATE TABLE dbo.OrderItem (
    OrderItemID INT IDENTITY(1,1) PRIMARY KEY,
    BookingID INT NOT NULL,
    ProductID INT NOT NULL,
    ItemType NVARCHAR(50) NOT NULL DEFAULT('Concession'), -- Concession or other
    Quantity INT NOT NULL DEFAULT(1) CHECK (Quantity > 0),
    UnitPrice DECIMAL(12,2) NOT NULL CHECK (UnitPrice >= 0),
    SubTotal AS (Quantity * UnitPrice) PERSISTED,
    Notes NVARCHAR(200) NULL, -- e.g., 'Extra butter'
    CONSTRAINT FK_OrderItem_Booking FOREIGN KEY (BookingID) REFERENCES dbo.Booking(BookingID) ON DELETE CASCADE,
    CONSTRAINT FK_OrderItem_Product FOREIGN KEY (ProductID) REFERENCES dbo.Product(ProductID)
);
CREATE INDEX IX_OrderItem_BookingID ON dbo.OrderItem(BookingID);
GO
/* ===================================================
   8. Promotion tables
   =================================================== */
-- Promotion (template)
CREATE TABLE dbo.Promotion (
    PromotionID INT IDENTITY(1,1) PRIMARY KEY,
    Code NVARCHAR(100) NULL UNIQUE, -- if global coupon code
    Description NVARCHAR(400) NULL,
    DiscountType NVARCHAR(20) NOT NULL DEFAULT('Percentage') CHECK (DiscountType IN ('Percentage', 'Fixed')),
    DiscountValue DECIMAL(12,2) NULL CHECK (DiscountValue >= 0),
    StartAt DATETIME2 NULL,
    EndAt DATETIME2 NULL,
    UsageLimit INT NULL CHECK (UsageLimit >= 0), -- total uses
    UsageCount INT NOT NULL DEFAULT(0) CHECK (UsageCount >= 0),
    IsActive BIT NOT NULL DEFAULT(1),
    AppliesTo NVARCHAR(50) NULL DEFAULT('Ticket') -- Ticket, Concession, Both
);
CREATE UNIQUE INDEX UX_Promotion_Code ON dbo.Promotion(Code) WHERE Code IS NOT NULL;
GO
-- PromotionUsage (track usage per booking)
CREATE TABLE dbo.PromotionUsage (
    UsageID INT IDENTITY(1,1) PRIMARY KEY,
    PromotionID INT NOT NULL,
    BookingID INT NOT NULL,
    DiscountApplied DECIMAL(12,2) NOT NULL CHECK (DiscountApplied >= 0),
    UsedAt DATETIME2 DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_PromotionUsage_Promotion FOREIGN KEY (PromotionID) REFERENCES dbo.Promotion(PromotionID),
    CONSTRAINT FK_PromotionUsage_Booking FOREIGN KEY (BookingID) REFERENCES dbo.Booking(BookingID) ON DELETE CASCADE,
    CONSTRAINT UX_PromotionUsage_Promotion_Booking UNIQUE (PromotionID, BookingID)
);
GO
-- PromotionAssignment (specific assignments, e.g., to screenings; made more flexible)
CREATE TABLE dbo.PromotionAssignment (
    PromotionAssignmentID INT IDENTITY(1,1) PRIMARY KEY,
    PromotionID INT NOT NULL,
    CinemaID INT NULL,
    MovieID INT NULL,
    ScreeningID INT NULL,
    SeatTypeID INT NULL, -- e.g., discount for VIP
    MaxUsesPerCustomer INT NULL CHECK (MaxUsesPerCustomer >= 0),
    IsActive BIT NOT NULL DEFAULT(1),
    CONSTRAINT FK_PromotionAssignment_Promotion FOREIGN KEY (PromotionID) REFERENCES dbo.Promotion(PromotionID),
    CONSTRAINT FK_PromotionAssignment_Cinema FOREIGN KEY (CinemaID) REFERENCES dbo.Cinema(CinemaID),
    CONSTRAINT FK_PromotionAssignment_Movie FOREIGN KEY (MovieID) REFERENCES dbo.Movie(MovieID),
    CONSTRAINT FK_PromotionAssignment_Screening FOREIGN KEY (ScreeningID) REFERENCES dbo.Screening(ScreeningID),
    CONSTRAINT FK_PromotionAssignment_SeatType FOREIGN KEY (SeatTypeID) REFERENCES dbo.SeatType(SeatTypeID)
);
CREATE INDEX IX_PromotionAssignment_PromotionID ON dbo.PromotionAssignment(PromotionID);
GO
-- Review
CREATE TABLE dbo.Review (
    ReviewID INT IDENTITY(1,1) PRIMARY KEY,
    MovieID INT NOT NULL,
    CustomerID INT NULL, -- NULL for anonymous
    MemberID INT NULL, -- Prefer member if available
    Rating TINYINT NOT NULL CHECK (Rating >= 1 AND Rating <= 5),
    Title NVARCHAR(200) NULL,
    Content NVARCHAR(MAX) NULL,
    PostedAt DATETIME2 DEFAULT SYSUTCDATETIME(),
    IsApproved BIT NOT NULL DEFAULT(0), -- moderation
    CONSTRAINT FK_Review_Movie FOREIGN KEY (MovieID) REFERENCES dbo.Movie(MovieID),
    CONSTRAINT FK_Review_Customer FOREIGN KEY (CustomerID) REFERENCES dbo.Customer(CustomerID),
    CONSTRAINT FK_Review_Member FOREIGN KEY (MemberID) REFERENCES dbo.[Member](MemberID),
    CONSTRAINT CK_Review_OneReviewer CHECK ((CustomerID IS NULL AND MemberID IS NULL) OR (CustomerID IS NOT NULL AND MemberID IS NULL) OR (MemberID IS NOT NULL AND CustomerID IS NULL)) -- one or none
);
CREATE INDEX IX_Review_MovieID ON dbo.Review(MovieID);
CREATE INDEX IX_Review_MemberID ON dbo.Review(MemberID);
GO
/* ===================================================
   9. Useful indexes & constraints (extras)
   =================================================== */
-- Index for screening availability
CREATE INDEX IX_Screening_Auditorium_StartAt ON dbo.Screening(AuditoriumID, StartAt);
GO
/* ===================================================
   10. Sample seed data (minimal) - enhanced for realism
   =================================================== */
-- Screen types
INSERT INTO dbo.ScreenType (Name, Description) VALUES
('2D', 'Standard 2D screen'),
('3D', '3D projection with glasses'),
('IMAX', 'IMAX screen with larger format and enhanced sound');
GO
-- Seat types
INSERT INTO dbo.SeatType (Name, Description) VALUES
('Standard', 'Standard reclining seat'),
('VIP', 'VIP padded seat with more legroom'),
('Couple', 'Couple seat (pair for two people)'),
('Accessible', 'Wheelchair accessible seat');
GO
-- Price categories
INSERT INTO dbo.PriceCategory (Name, Description, BasePrice) VALUES
('Adult', 'Standard adult ticket', 100000.00),
('Child', 'Child under 12', 70000.00),
('Senior', 'Senior over 60', 80000.00),
('Matinee', 'Morning show discount (before 2PM)', 80000.00);
GO
-- One Cinema + Auditoriums + Seats
INSERT INTO dbo.Cinema (Name, Address, City, StateProvince, PostalCode, Phone, Email) VALUES
('Galaxy Cinema - Downtown', '123 Lê Lợi, District 1', 'Ho Chi Minh City', 'HCMC', '700000', '0281234567', 'info@galaxycinema.vn');
GO
INSERT INTO dbo.Auditorium (CinemaID, Name, ScreenTypeID, Capacity) VALUES
(1, 'Hall 1 - IMAX', 3, 150),
(1, 'Hall 2 - Standard', 1, 120),
(1, 'Hall 3 - 3D', 2, 100);
GO
-- Some seats for Hall 1 (partial, with sections)
INSERT INTO dbo.Seat (AuditoriumID, [Row], [Number], Label, SeatTypeID, Section, IsAccessible) VALUES
(1, 'A', 1, 'A1', 1, 'Center', 0),
(1, 'A', 2, 'A2', 1, 'Center', 0),
(1, 'A', 3, 'A3', 2, 'Center', 0), -- VIP
(1, 'B', 1, 'B1', 1, 'Left', 0),
(1, 'Z', 1, 'Z1', 4, 'Center', 1); -- Accessible
GO
-- Sample movie
INSERT INTO dbo.Movie (Title, Synopsis, DurationMinutes, Language, ReleaseDate, Country, Rating, Status, PosterURL) VALUES
('The Great Adventure', 'An epic journey through time and space.', 125, 'Vietnamese', '2025-07-01', 'Vietnam', 'PG-13', 'NowShowing', 'https://example.com/poster1.jpg'),
('Space Odyssey', 'Explorers discover ancient secrets in the cosmos.', 140, 'English', '2025-09-15', 'USA', 'R', 'ComingSoon', 'https://example.com/poster2.jpg');
GO
-- Genre
INSERT INTO dbo.Genre (Name, Description) VALUES 
('Sci-Fi', 'Science fiction genre');
GO
-- MovieGenre
INSERT INTO dbo.MovieGenre (MovieID, GenreID) VALUES (1, 1), (2, 1);
GO
-- Sample persons
INSERT INTO dbo.Person (FullName, DOB, RoleType, Nationality) VALUES
('Nguyễn Văn A', '1980-05-15', 'Actor', 'Vietnam'),
('John Doe', '1975-03-20', 'Director', 'USA');
GO
-- MovieCast
INSERT INTO dbo.MovieCast (MovieID, PersonID, CharacterName, BillingOrder) VALUES
(1, 1, 'Hero', 1),
(2, 2, NULL, 1); -- Director has no character
GO
-- Sample screening
INSERT INTO dbo.Screening (MovieID, AuditoriumID, StartAt, EndAt, Language, Subtitles, PriceCategoryID, Is3D) VALUES
(1, 1, '2025-11-20 10:00:00', '2025-11-20 12:05:00', 'Vietnamese', 'English', 1, 0),
(1, 1, '2025-11-20 18:00:00', '2025-11-20 20:05:00', 'Vietnamese', 'None', 1, 0),
(2, 2, '2025-11-25 20:00:00', '2025-11-25 22:20:00', 'English', 'Vietnamese', 4, 1); -- 3D matinee
GO
-- Sample roles
INSERT INTO dbo.[Role] (Name, Description, Permissions) VALUES
('Manager', 'Cinema manager', '["full_access"]'),
('Cashier', 'Ticket seller', '["sell_tickets", "pos"]');
GO
-- Sample employee
INSERT INTO dbo.Employee (CinemaID, FullName, Email, Phone, RoleID, HireDate) VALUES
(1, 'Trần Thị B', 'b.tran@galaxycinema.vn', '0909123456', 1, '2024-01-01');
GO
-- Sample customer + member + booking + seat reservation + ticket + payment
INSERT INTO dbo.Customer (Email, Phone, FullName, Address, City, DateOfBirth, Gender, IsMember) VALUES 
('ng.long@example.com', '0909123456', 'Nguyễn Lê Tiểu Long', '456 Nguyễn Huệ, District 1', 'Ho Chi Minh City', '1990-08-10', 'Male', 1);
GO
INSERT INTO dbo.[Member] (CustomerID, Username, PasswordHash, Points, MembershipLevel, JoinDate) VALUES
(1, 'nglong', '5f4dcc3b5aa765d61d8327deb882cf99', 0, 'Silver', '2024-06-01'); -- Dummy MD5 hash for 'password'
GO
INSERT INTO dbo.Booking (MemberID, Status, TotalAmount, BookingReference, CreatedAt, ExpiresAt) VALUES
(1, 'Confirmed', 120000.00, 'BK-20251117-001', SYSUTCDATETIME(), NULL);
GO
-- Hold a seat (now confirmed since booking is confirmed)
INSERT INTO dbo.SeatReservation (ScreeningID, SeatID, BookingID, ReservedUntil, Status) VALUES
(1, 1, 1, DATEADD(MINUTE, 10, SYSUTCDATETIME()), 'Confirmed');
GO
-- Create ticket after payment
INSERT INTO dbo.Ticket (BookingID, ScreeningID, SeatID, Price, TicketType, Status, Barcode, SeatLabel) VALUES
(1, 1, 1, 100000.00, 'Adult', 'Booked', 'BC-0001-QR', 'A1');
GO
-- Payment
INSERT INTO dbo.Payment (BookingID, Amount, Method, Status, TransactionID, PaidAt) VALUES
(1, 100000.00, 'Card', 'Completed', 'TXN-123456789', SYSUTCDATETIME());
GO
-- Sample product
INSERT INTO dbo.Product (Name, Price, Category, IsAvailable, StockQuantity) VALUES
('Popcorn Large', 50000.00, 'Snacks', 1, 100),
('Cola Medium', 30000.00, 'Drinks', 1, 50);
GO
-- Sample order item (concession)
INSERT INTO dbo.OrderItem (BookingID, ProductID, ItemType, Quantity, UnitPrice, Notes) VALUES
(1, 1, 'Concession', 1, 50000.00, 'Extra butter');
GO
-- Sample promotion
INSERT INTO dbo.Promotion (Code, Description, DiscountType, DiscountValue, StartAt, EndAt, UsageLimit, AppliesTo) VALUES
('WELCOME10', '10% off first ticket', 'Percentage', 10.00, '2025-11-01', '2025-12-31', 1000, 'Ticket');
GO
-- Sample promotion assignment
INSERT INTO dbo.PromotionAssignment (PromotionID, CinemaID, MovieID, MaxUsesPerCustomer) VALUES
(1, 1, 1, 1);
GO
-- Sample review
INSERT INTO dbo.Review (MovieID, MemberID, Rating, Title, Content) VALUES
(1, 1, 5, 'Amazing!', 'Best movie ever!');
GO