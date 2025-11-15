
using CineGo.Models.DTOs;
using CineGo.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace CineGo.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly CinemaDbContext _context;
        private readonly IPasswordHasher<Member> _passwordHasher;
        private readonly IConfiguration _config;

        public AuthController(CinemaDbContext context, IPasswordHasher<Member> passwordHasher, IConfiguration config)
        {
            _context = context;
            _passwordHasher = passwordHasher;
            _config = config;
        }

        // POST: api/auth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDTO registerRequest)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (await _context.Customers.AnyAsync(c => c.Email == registerRequest.Email))
            {
                return Conflict(new { message = "Email đã tồn tại." });
            }
            if (await _context.Customers.AnyAsync(c => c.Phone == registerRequest.Phone))
            {
                return Conflict(new { message = "Số điện thoại đã tồn tại." });
            }

            var customer = new Customer
            {
                FullName = registerRequest.FullName,
                Email = registerRequest.Email,
                Phone = registerRequest.Phone,
                DateOfBirth = registerRequest.DateOfBirth, // Đã sửa DTO nên giờ đây khớp (DateOnly?)
                IsMember = true,
                // TODO: Gán Gender, Address, City
            };

            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();
            // Sau khi SaveChanges, customer.CustomerId (chữ d thường) đã có giá trị

            var member = new Member
            {
                // SỬA LỖI: Dùng CustomerId (chữ d thường)
                CustomerId = customer.CustomerId,
                Username = registerRequest.Email,
                Points = 0,
                MembershipLevel = "Standard"
            };

            member.PasswordHash = _passwordHasher.HashPassword(member, registerRequest.Password);

            _context.Members.Add(member);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đăng ký thành công!" });
        }


        // POST: api/auth/login
        [HttpPost("login")]
        public async Task<ActionResult<LoginResponseDTO>> Login([FromBody] LoginRequestDTO loginRequest)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.Phone == loginRequest.Phone);

            if (customer == null)
            {
                return Unauthorized(new { message = "Số điện thoại hoặc mật khẩu không đúng." });
            }

            var member = await _context.Members
                // SỬA LỖI: Dùng CustomerId (chữ d thường)
                .FirstOrDefaultAsync(m => m.CustomerId == customer.CustomerId);

            if (member == null)
            {
                return Unauthorized(new { message = "Tài khoản không tồn tại hoặc chưa được kích hoạt." });
            }

            var verificationResult = _passwordHasher.VerifyHashedPassword(member, member.PasswordHash, loginRequest.Password);

            if (verificationResult == PasswordVerificationResult.Failed)
            {
                return Unauthorized(new { message = "Số điện thoại hoặc mật khẩu không đúng." });
            }

            var token = GenerateJwtToken(member, customer);

            var userProfile = new UserProfileDTO
            {
                // SỬA LỖI: Dùng MemberId và CustomerId (chữ d thường)
                MemberId = member.MemberId,
                CustomerId = customer.CustomerId,
                Username = member.Username,
                FullName = customer.FullName,
                Email = customer.Email,
                Phone = customer.Phone,
                DateOfBirth = customer.DateOfBirth, // Đã sửa DTO nên giờ đây khớp (DateOnly?)
                Points = member.Points,
                MembershipLevel = member.MembershipLevel
            };

            return Ok(new LoginResponseDTO { Token = token, User = userProfile });
        }

        private string GenerateJwtToken(Member member, Customer customer)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, member.Username),
                new Claim(JwtRegisteredClaimNames.Email, customer.Email),
                new Claim(ClaimTypes.Name, customer.FullName),
                // SỬA LỖI: Dùng MemberId và CustomerId (chữ d thường)
                new Claim(ClaimTypes.NameIdentifier, member.MemberId.ToString()),
                new Claim("customer_id", customer.CustomerId.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(24),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}