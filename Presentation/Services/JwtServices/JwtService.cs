using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using Presentation.Models;
using Presentation.PresentationDto.UserDto;

namespace Presentation.Services.JwtServicies;

public class JwtService : IJwtService
{
    private readonly JwtServiceStruct _jwtServiceStruct;

    public JwtService(JwtServiceStruct jwtServiceStruct)
    {
        _jwtServiceStruct = jwtServiceStruct;
    }

    public async Task<string> GenerateJwtAsync(UserToJwtDto dto)
    {
        ClaimsIdentity identities = new ClaimsIdentity(
        [
            new (ClaimTypes.NameIdentifier, dto.Id.ToString()),
            new(ClaimTypes.Name, dto.Username),
            new(ClaimTypes.Email, dto.Email),
        ]);

        SecurityKey secret = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtServiceStruct.SecretKey));
        SigningCredentials credentials = new SigningCredentials(secret, _jwtServiceStruct.Alg);
        
        var handler = new JwtSecurityTokenHandler();
        SecurityTokenDescriptor tokenDescriptor = new()
        {
            Expires = DateTime.UtcNow.AddHours(1),
            Audience = _jwtServiceStruct.Audience,
            Issuer = _jwtServiceStruct.Issuer,
            Subject = identities,
            SigningCredentials = credentials,
        };
        
        var token = handler.CreateToken(tokenDescriptor);
        return handler.WriteToken(token);
    }

    public async Task<bool> IsTokenValid(string email)
    {
        return true;
    }
}