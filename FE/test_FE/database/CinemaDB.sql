
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
    BasePrice DECIMAL(10,2) NOT NULL
);
GO

/* ===================================================
   3. Main business entities
   =================================================== */

-- Cinema (chain / physical location)
CREATE TABLE dbo.Cinema (
    CinemaID INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(200) NOT NULL,
    Address NVARCHAR(400) NULL,
    City NVARCHAR(100) NULL,
    Phone NVARCHAR(50) NULL
);
GO

-- Auditorium (Hall)
CREATE TABLE dbo.Auditorium (
    AuditoriumID INT IDENTITY(1,1) PRIMARY KEY,
    CinemaID INT NOT NULL,
    Name NVARCHAR(100) NOT NULL,
    ScreenTypeID INT NULL,
    Capacity INT NOT NULL DEFAULT(0),
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
    [Number] INT NOT NULL,
	Label VARCHAR (50) NOT NULL,
    SeatTypeID INT NULL,
    IsAvailable BIT NOT NULL DEFAULT(1),
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
    DurationMinutes INT NOT NULL,
    Language NVARCHAR(50) NULL,
    ReleaseDate DATE NULL,
    Country NVARCHAR(100) NULL,
    Rating NVARCHAR(50) NULL,
    Status NVARCHAR(50) NOT NULL DEFAULT('ComingSoon'),
);
GO

-- Genre 
CREATE TABLE dbo.Genre (
    GenreID INT IDENTITY(1,1) PRIMARY KEY,
	MovieID INT NOT NULL,
    Name NVARCHAR(100) NOT NULL
);
GO

-- Person (actors, directors)
CREATE TABLE dbo.Person (
    PersonID INT IDENTITY(1,1) PRIMARY KEY,
    FullName NVARCHAR(200) NOT NULL,
    DOB DATE NULL,
    RoleType NVARCHAR(50) NULL -- e.g., Actor, Director, Crew
);
GO

-- MovieCast junction
CREATE TABLE dbo.MovieCast (
    MovieID INT NOT NULL,
    PersonID INT NOT NULL,
    CharacterName NVARCHAR(200) NULL,
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
    Status NVARCHAR(30) NOT NULL DEFAULT('Scheduled'),
    CONSTRAINT FK_Screening_Movie FOREIGN KEY (MovieID) REFERENCES dbo.Movie(MovieID),
    CONSTRAINT FK_Screening_Auditorium FOREIGN KEY (AuditoriumID) REFERENCES dbo.Auditorium(AuditoriumID),
);
CREATE INDEX IX_Screening_StartAt ON dbo.Screening(StartAt);
CREATE INDEX IX_Screening_AuditoriumID ON dbo.Screening(AuditoriumID);
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
    Multiplier DECIMAL(6,4) NOT NULL DEFAULT(1.0000), 
    ConditionDescription NVARCHAR(500) NULL,
    CONSTRAINT FK_PriceAssignment_PriceCategory FOREIGN KEY (PriceCategoryID) REFERENCES dbo.PriceCategory(PriceCategoryID),
    CONSTRAINT FK_PriceAssignment_Auditorium FOREIGN KEY (AuditoriumID) REFERENCES dbo.Auditorium(AuditoriumID),
    CONSTRAINT FK_PriceAssignment_SeatType FOREIGN KEY (SeatTypeID) REFERENCES dbo.SeatType(SeatTypeID)
);
CREATE INDEX IX_PriceAssignment_PriceCategory ON dbo.PriceAssignment(PriceCategoryID);
GO

/* ===================================================
   5. Customers, Members, Employees, Roles
   =================================================== */

-- Customer
CREATE TABLE dbo.Customer (
    CustomerID INT IDENTITY(1,1) PRIMARY KEY,
    Email NVARCHAR(200) NULL,
    Phone NVARCHAR(50) NULL,
    FullName NVARCHAR(200) NULL,
    DateOfBirth DATE NULL,
    IsMember BIT NOT NULL DEFAULT(0),
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
    Points INT NOT NULL DEFAULT(0),
    MembershipLevel NVARCHAR(100) NULL,
    CONSTRAINT FK_Member_Customer FOREIGN KEY (CustomerID) REFERENCES dbo.Customer(CustomerID)
);
GO

-- Role
CREATE TABLE dbo.[Role] (
    RoleID INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL UNIQUE,
    Permissions NVARCHAR(MAX) NULL
);
GO

---- Employee
--CREATE TABLE dbo.Employee (
--    EmployeeID INT IDENTITY(1,1) PRIMARY KEY,
--    CinemaID INT NULL,
--    FullName NVARCHAR(200) NOT NULL,
--    Email NVARCHAR(200) NULL,
--    Phone NVARCHAR(50) NULL,
--    RoleID INT NULL,
--    IsActive BIT NOT NULL DEFAULT(1),
--    CreatedAt DATETIME2 DEFAULT SYSUTCDATETIME(),
--    UpdatedAt DATETIME2 NULL,
--    CONSTRAINT FK_Employee_Cinema FOREIGN KEY (CinemaID) REFERENCES dbo.Cinema(CinemaID),
--    CONSTRAINT FK_Employee_Role FOREIGN KEY (RoleID) REFERENCES dbo.[Role](RoleID)
--);
--CREATE UNIQUE INDEX UX_Employee_Email ON dbo.Employee(Email) WHERE Email IS NOT NULL;
--GO

/* ===================================================
   6. Booking, SeatReservation, Ticket, Payment
   =================================================== */

-- Booking (Order)
CREATE TABLE dbo.Booking (
    BookingID INT IDENTITY(1,1) PRIMARY KEY,
    MemberID INT NULL,
    Status NVARCHAR(50) NOT NULL DEFAULT('Pending'), -- Pending, Confirmed, Cancelled, Expired
    TotalAmount DECIMAL(12,2) NOT NULL DEFAULT(0.00),
    CreatedAt DATETIME2 DEFAULT SYSUTCDATETIME(),
    ExpiresAt DATETIME2 NULL,
    CONSTRAINT FK_Booking_Customer FOREIGN KEY (MemberID) REFERENCES dbo.Member(MemberID)
);
CREATE INDEX IX_Booking_CustomerID ON dbo.Booking(MemberID);
CREATE INDEX IX_Booking_Status ON dbo.Booking(Status);
GO

-- SeatReservation (hold)
CREATE TABLE dbo.SeatReservation (
    ReservationID INT IDENTITY(1,1) PRIMARY KEY,
    ScreeningID INT NOT NULL,
    SeatID INT NOT NULL,
    BookingID INT NULL,
    ReservedUntil DATETIME2 NOT NULL,
    Status NVARCHAR(50) NOT NULL DEFAULT('Held'), -- Held, Released, Confirmed
    CONSTRAINT FK_SeatReservation_Screening FOREIGN KEY (ScreeningID) REFERENCES dbo.Screening(ScreeningID),
    CONSTRAINT FK_SeatReservation_Seat FOREIGN KEY (SeatID) REFERENCES dbo.Seat(SeatID),
    CONSTRAINT FK_SeatReservation_Booking FOREIGN KEY (BookingID) REFERENCES dbo.Booking(BookingID)
);
CREATE UNIQUE INDEX UX_SeatReservation_Screening_Seat ON dbo.SeatReservation(ScreeningID, SeatID) -- ensure 1 reservation per seat per screening
WHERE Status IN ('Held','Confirmed'); -- optional filter to avoid locking released rows
GO

-- Ticket
CREATE TABLE dbo.Ticket (
    TicketID INT IDENTITY(1,1) PRIMARY KEY,
    BookingID INT NOT NULL,
    ScreeningID INT NOT NULL,
    SeatID INT NOT NULL,
    Price DECIMAL(12,2) NOT NULL,
    TicketType NVARCHAR(50) NULL, -- Adult, Child, Senior
    Status NVARCHAR(50) NOT NULL DEFAULT('Booked'), -- Booked, CheckedIn, Cancelled, Refunded
    CONSTRAINT FK_Ticket_Booking FOREIGN KEY (BookingID) REFERENCES dbo.Booking(BookingID) ON DELETE CASCADE,
    CONSTRAINT FK_Ticket_Screening FOREIGN KEY (ScreeningID) REFERENCES dbo.Screening(ScreeningID),
    CONSTRAINT FK_Ticket_Seat FOREIGN KEY (SeatID) REFERENCES dbo.Seat(SeatID)
);
CREATE INDEX IX_Ticket_BookingID ON dbo.Ticket(BookingID);
CREATE INDEX IX_Ticket_ScreeningID ON dbo.Ticket(ScreeningID);
GO

-- Payment
CREATE TABLE dbo.Payment (
    PaymentID INT IDENTITY(1,1) PRIMARY KEY,
    BookingID INT NOT NULL,
    Amount DECIMAL(12,2) NOT NULL,
    Method NVARCHAR(50) NOT NULL, -- Card, Cash, EWallet
    Status NVARCHAR(50) NOT NULL DEFAULT('Pending'), -- Pending, Completed, Failed, Refunded
    PaidAt DATETIME2 NULL,
    CONSTRAINT FK_Payment_Booking FOREIGN KEY (BookingID) REFERENCES dbo.Booking(BookingID)
);
CREATE INDEX IX_Payment_BookingID ON dbo.Payment(BookingID);
GO

/* ===================================================
   7. Product (POS) tables
   =================================================== */

-- Product item
CREATE TABLE dbo.Product (
    ProductID INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(200) NOT NULL,
    Price DECIMAL(12,2) NOT NULL,
    Category NVARCHAR(100) NULL,
    IsAvailable BIT NOT NULL DEFAULT(1)
);
GO

CREATE TABLE dbo.OrderItem (
    OrderItemID INT IDENTITY(1,1) PRIMARY KEY,
    ProductID INT NOT NULL,
	BookingID INT NOT NULL,
	ItemType NVARCHAR(200) NOT NULL,
    Quantity INT NOT NULL DEFAULT(1),
	SubTotal DECIMAL(12,2) NOT NULL,
    UnitPrice DECIMAL(12,2) NOT NULL,
    CONSTRAINT FK_ProductOrderItem_Product FOREIGN KEY (ProductID) REFERENCES dbo.Product(ProductID)
);
GO

/* ===================================================
   8. Promotion tables
   =================================================== */

-- Promotion (template)
CREATE TABLE dbo.Promotion (
    PromotionID INT IDENTITY(1,1) PRIMARY KEY,
    Code NVARCHAR(100) NULL, -- if global coupon code
    Description NVARCHAR(400) NULL,
    DiscountValue DECIMAL(12,2) NULL, -- percent or amount
    StartAt DATETIME2 NULL,
    EndAt DATETIME2 NULL,
    UsageLimit INT NULL, -- total uses
    IsActive BIT NOT NULL DEFAULT(1)
);
CREATE UNIQUE INDEX UX_Promotion_Code ON dbo.Promotion(Code) WHERE Code IS NOT NULL;
GO

-- PromotionAssignment (voucher distribution / usage recording)
CREATE TABLE dbo.PromotionAssignment (
    PromotionAssignmentID INT IDENTITY(1,1) PRIMARY KEY,
    PromotionID INT NOT NULL,
    MovieID INT NOT NULL,
	ScreeningID INT NOT NULL,
	CinemaID INT NOT NULL,
    CONSTRAINT FK_PromotionAssignment_Promotion FOREIGN KEY (PromotionID) REFERENCES dbo.Promotion(PromotionID),
    CONSTRAINT FK_PromotionAssignment_Movie FOREIGN KEY (MovieID) REFERENCES dbo.Movie(MovieID),
    CONSTRAINT FK_PromotionAssignment_Screening FOREIGN KEY (ScreeningID) REFERENCES dbo.Screening(ScreeningID),
	CONSTRAINT FK_PromotionAssignment_Cinema FOREIGN KEY (CinemaID) REFERENCES dbo.Cinema(CinemaID)
);
CREATE INDEX IX_PromotionAssignment_PromotionID ON dbo.PromotionAssignment(PromotionID);
GO


-- Review
CREATE TABLE dbo.Review (
    ReviewID INT IDENTITY(1,1) PRIMARY KEY,
    MovieID INT NOT NULL,
    CustomerID INT NOT NULL,
    Rating TINYINT NOT NULL CHECK (Rating >= 1 AND Rating <= 5),
    Title NVARCHAR(200) NULL,
    Content NVARCHAR(MAX) NULL,
    CONSTRAINT FK_Review_Movie FOREIGN KEY (MovieID) REFERENCES dbo.Movie(MovieID),
    CONSTRAINT FK_Review_Customer FOREIGN KEY (CustomerID) REFERENCES dbo.Customer(CustomerID)
);
CREATE INDEX IX_Review_MovieID ON dbo.Review(MovieID);
GO

/* ===================================================
   10. Useful indexes & constraints (extras)
   =================================================== */

-- Composite index for booking lookup
CREATE INDEX IX_Booking_CreatedAt_Status ON dbo.Booking(CreatedAt, Status);
GO

-- Index to find held seats for screening quickly
CREATE INDEX IX_SeatReservation_Screening_ReservedUntil ON dbo.SeatReservation(ScreeningID, ReservedUntil);
GO

/* ===================================================
   11. Sample seed data (minimal) - you can remove later
   =================================================== */

-- Screen types
INSERT INTO dbo.ScreenType (Name, Description) VALUES
('2D', 'Standard 2D screen'),
('3D', '3D projection'),
('IMAX', 'IMAX screen with larger format');
GO

-- Seat types
INSERT INTO dbo.SeatType (Name, Description) VALUES
('Standard', 'Standard seat'),
('VIP', 'VIP padded seat'),
('Couple', 'Couple seat (pair)');
GO

-- Price categories
INSERT INTO dbo.PriceCategory (Name, Description, BasePrice) VALUES
('Default', 'Default base price', 100000.00),
('Matinee', 'Morning show discount', 80000.00);
GO

-- One Cinema + Auditoriums + Seats
INSERT INTO dbo.Cinema (Name, Address, City, Phone) VALUES
('Galaxy Cinema - Downtown', '123 Lê Lợi, District 1', 'HCM', '0281234567');
GO

INSERT INTO dbo.Auditorium (CinemaID, Name, ScreenTypeID, Capacity) VALUES
(1, 'Hall 1', 3, 150),
(1, 'Hall 2', 1, 120);
GO

-- Some seats for Hall 1 (partial)
INSERT INTO dbo.Seat (AuditoriumID, [Row], [Number], Label, SeatTypeID) VALUES
(1, 'A', 1, 'A1', 1),
(1, 'A', 2, 'A2', 1),
(1, 'A', 3, 'A3', 2), -- VIP
(1, 'B', 1, 'B1', 1);
GO

-- Sample movie
INSERT INTO dbo.Movie (Title, DurationMinutes, Language, ReleaseDate, Status) VALUES
('The Great Adventure', 125, 'Vietnamese', '2025-07-01', 'NowShowing'),
('Space Odyssey', 140, 'English', '2025-09-15', 'ComingSoon');
GO

-- Genre 
INSERT INTO dbo.Genre (MovieID, Name) VALUES (1, 'Sci-Fi');
GO

-- Sample screening
INSERT INTO dbo.Screening (MovieID, AuditoriumID, StartAt, EndAt) VALUES
(1, 1, '2025-10-30 10:00:00', '2025-10-30 12:05:00'),
(1, 1, '2025-10-30 18:00:00', '2025-10-30 20:05:00');
GO

-- Sample customer + booking + seat reservation + ticket
INSERT INTO dbo.Customer (Email, Phone, FullName, IsMember) VALUES ('ng.long@example.com','0909123456','Nguyễn Lê Tiểu Long', 1);
GO

INSERT INTO dbo.Booking (MemberID, Status, TotalAmount, CreatedAt, ExpiresAt) VALUES
(1, 'Pending', 0.00, SYSUTCDATETIME(), DATEADD(MINUTE, 10, SYSUTCDATETIME()));
GO

-- Hold a seat
INSERT INTO dbo.SeatReservation (ScreeningID, SeatID, BookingID, ReservedUntil, Status) VALUES
(1, 1, 1, DATEADD(MINUTE, 10, SYSUTCDATETIME()), 'Held');
GO

-- create ticket after payment (example)
INSERT INTO dbo.Ticket (BookingID, ScreeningID, SeatID, Price, TicketType, Status, Barcode) VALUES
(1, 1, 1, 100000.00, 'Adult', 'Booked', 'BC-0001');
GO

-- Payment
INSERT INTO dbo.Payment (BookingID, Amount, Method, Status, PaidAt) VALUES
(1, 100000.00, 'Card', 'Completed', SYSUTCDATETIME());
GO


