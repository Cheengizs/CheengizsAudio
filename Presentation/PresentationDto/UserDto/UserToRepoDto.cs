using Presentation.Repositories.UserRepositories;

namespace Presentation.PresentationDto.UserDto;

public record UserToRepoDto(string Username, string HashPassword, string Email);
