namespace CineGo.Models.DTOs
{
    public class UserProfileDTO
    {
        public int MemberId { get; set; }
        public int CustomerId { get; set; }
        public string Username { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }

        // SỬA LỖI: Dùng DateOnly? để khớp với kiểu DATE trong SQL
        public DateOnly? DateOfBirth { get; set; }

        public string? Gender { get; set; }
        public string? Address { get; set; }
        public int Points { get; set; }
        public string? MembershipLevel { get; set; }
    }
}
