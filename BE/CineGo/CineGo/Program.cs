// Thêm các using cần thiết
using CineGo.Models; // Namespace chứa CinemaDbContext, Member, Customer
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

namespace CineGo
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // --- LẤY CẤU HÌNH ---
            var connectionString = builder.Configuration.GetConnectionString("DBDefault");
            if (string.IsNullOrEmpty(connectionString))
            {
                throw new InvalidOperationException("Không tìm thấy chuỗi kết nối 'DBDefault' trong appsettings.json.");
            }

            var jwtKey = builder.Configuration["Jwt:Key"];
            if (string.IsNullOrEmpty(jwtKey))
            {
                throw new InvalidOperationException("Không tìm thấy 'Jwt:Key' trong appsettings.json.");
            }

            // --- ĐĂNG KÝ DỊCH VỤ (SERVICES) ---

            // 1. Thêm Dịch vụ CORS
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowReactApp", policy =>
                {
                    // Đảm bảo URL này khớp với cổng React app của bạn (thường là 5173)
                    policy.WithOrigins("http://localhost:5173")
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                });
            });

            // 2. Đăng ký DbContext
            builder.Services.AddDbContext<CinemaDbContext>(options =>
                options.UseSqlServer(connectionString));

            // 3. Đăng ký Password Hasher
            builder.Services.AddScoped<IPasswordHasher<Member>, PasswordHasher<Member>>();

            // 4. Đăng ký Authentication + JWT
            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = builder.Configuration["Jwt:Issuer"],
                    ValidAudience = builder.Configuration["Jwt:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
                };
            });

            // 5. Thêm Controllers và Swagger
            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // --- BUILD APP ---
            var app = builder.Build();

            // --- CẤU HÌNH MIDDLEWARE (THỨ TỰ RẤT QUAN TRỌNG) ---

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            // SỬA LỖI: Vô hiệu hóa dòng này
            // Dòng này BẮT BUỘC chuyển http (5232) sang https (7144)
            // Bằng cách vô hiệu hóa nó, API sẽ chấp nhận request từ http://localhost:5232
            // app.UseHttpsRedirection(); 

            // 1. Dùng Routing
            app.UseRouting();

            // 2. Dùng CORS (SAU UseRouting, TRƯỚC UseAuthentication)
            // Đây là mấu chốt để sửa lỗi "Failed to fetch"
            app.UseCors("AllowReactApp");

            // 3. Dùng Authentication
            app.UseAuthentication();

            // 4. Dùng Authorization
            app.UseAuthorization();

            // 5. Map Controllers
            app.MapControllers();

            app.Run();
        }
    }
}