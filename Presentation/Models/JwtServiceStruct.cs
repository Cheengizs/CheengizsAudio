using Microsoft.IdentityModel.Tokens;
using Presentation.PresentationDto.UserDto;

namespace Presentation.Models;

public struct JwtServiceStruct
{
    public readonly string SecretKey;
    public readonly string Issuer;
    public readonly string Audience;
    public readonly string Alg;

    public JwtServiceStruct(string secretKey, string issuer, string audience, string alg)
    {
        this.SecretKey = secretKey;
        this.Issuer = issuer;
        Audience = audience;
        Alg = alg;
    }
}