using Microsoft.AspNetCore.Identity;
using Presentation.Repositories.UserRepositories;

namespace Presentation.Services;

public class UserPasswordHasher : IUserPasswordHasher
{
    public string HashPassword(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password, 15);
    }

    public bool VerifyPassword(string password, string hashedPassword)
    {
        return BCrypt.Net.BCrypt.Verify(password, hashedPassword);
    }
}