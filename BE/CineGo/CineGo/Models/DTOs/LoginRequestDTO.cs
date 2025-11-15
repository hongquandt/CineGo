using System.ComponentModel.DataAnnotations;

namespace CineGo.Models.DTOs
{
    public class LoginRequestDTO
    {
        [Required]
        public string Phone { get; set; } // Form của bạn dùng "Phone number"

        [Required]
        public string Password { get; set; }
    }
}
