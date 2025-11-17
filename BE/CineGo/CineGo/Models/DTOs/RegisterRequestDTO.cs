using System.ComponentModel.DataAnnotations;

namespace CineGo.Models.DTOs
{
    public class RegisterRequestDTO
    {
        [Required(ErrorMessage = "Họ và tên là bắt buộc.")]
        public string FullName { get; set; } = null!;

        [Required(ErrorMessage = "Email là bắt buộc.")]
        [EmailAddress(ErrorMessage = "Định dạng email không hợp lệ.")]
        public string Email { get; set; } = null!;

        [Required(ErrorMessage = "Số điện thoại là bắt buộc.")]
        public string Phone { get; set; } = null!;

        [Required(ErrorMessage = "Ngày sinh là bắt buộc.")]
        public DateOnly? DateOfBirth { get; set; }

        [Required(ErrorMessage = "Giới tính là bắt buộc.")]
        public string Gender { get; set; } = null!;

        [Required(ErrorMessage = "Mật khẩu là bắt buộc.")]
        [MinLength(6, ErrorMessage = "Mật khẩu phải có ít nhất 6 ký tự.")]
        public string Password { get; set; } = null!;

        [Required(ErrorMessage = "Địa chỉ là bắt buộc.")]
        public string Address { get; set; } = null!;

        [Required(ErrorMessage = "Thành phố là bắt buộc.")]
        public string City { get; set; } = null!;
    }
}