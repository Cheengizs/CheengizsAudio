using Presentation.PresentationDto.UserDto;

namespace Presentation.Services.JwtServicies;

public interface IJwtService
{
    Task<string> GenerateJwtAsync(UserToJwtDto dto);
    Task<bool> IsTokenValid(string email);
}