using System.Text;
using Presentation;
using Presentation.Models;
using Presentation.Services;
using Microsoft.IdentityModel.Tokens;
using Presentation.Services.JwtServicies;
using Presentation.Repositories.UserRepositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;

var builder = WebApplication.CreateBuilder(args);

string connectionString = builder.Configuration.GetConnectionString("sqlServer")!;

string secretKey = builder.Configuration["JwtOptions:SecretKey"]!;
string issuer = builder.Configuration["JwtOptions:Issuer"]!;
string audience = builder.Configuration["JwtOptions:Audience"]!;

JwtServiceStruct jwtServiceStruct = new(secretKey, issuer, audience, SecurityAlgorithms.HmacSha256Signature);

builder.Services.AddOpenApi();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddControllers();

builder.Services.AddSingleton<IAudioDbContext>(new AudioDbContext(connectionString));
builder.Services.AddScoped<IJwtService>(sp => new JwtService(jwtServiceStruct));

builder.Services.AddScoped<IMusicRepository, MusicRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserPasswordHasher, UserPasswordHasher>();

builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters()
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidIssuer = jwtServiceStruct.Issuer,
            ValidAudience = jwtServiceStruct.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
            ValidateIssuerSigningKey = true,
        };
    });

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors();

app.UseRouting();
app.MapControllers();

app.UseAuthentication();
app.UseAuthorization();

app.Run();