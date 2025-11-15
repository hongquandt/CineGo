using System.ComponentModel.DataAnnotations;

namespace CineGo.Models.DTOs
{
    public class RegisterRequestDTO
    {
        [Required(ErrorMessage = "Full name is required.")]
        public string FullName { get; set; }

        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Invalid email format.")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Phone is required.")]
        public string Phone { get; set; }

        public DateOnly? DateOfBirth { get; set; }

        public string? Gender { get; set; }

        [Required(ErrorMessage = "Password is required.")]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters.")]
        public string Password { get; set; }

        // XÓA BỎ HOÀN TOÀN 'ConfirmPassword' KHỎI FILE NÀY
        // [Required]
        // [Compare("Password")]
        // public string ConfirmPassword { get; set; }

        public string? Address { get; set; }
        public string? City { get; set; }
    }
}