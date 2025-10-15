using Presentation.Models;
using Presentation.PresentationDto.UserDto;

namespace Presentation.Repositories.UserRepositories;

public interface IUserRepository
{
    Task AddUserAsync(UserToRepoDto dto);
    Task<User?> GetUserByEmailAsync(string email);
    Task<bool> UserExistsAsync(string email);
}