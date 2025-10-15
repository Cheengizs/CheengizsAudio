using Dapper;
using Presentation.Models;
using Presentation.PresentationDto.UserDto;

namespace Presentation.Repositories.UserRepositories;

public class UserRepository : IUserRepository
{
    private readonly IAudioDbContext _context;

    public UserRepository(IAudioDbContext dbContext)
    {
        _context = dbContext;
    }
    
    public async Task AddUserAsync(UserToRepoDto dto)
    {
        await using var connection = _context.GetConnection();
        await connection.OpenAsync();

        string sql = "INSERT INTO app_user (Username, HashPassword, Email) "+
                     "VALUES (@Username, @HashPassword, @Email)";

        await connection.ExecuteAsync(sql, dto);
    }

    public async Task<User?> GetUserByEmailAsync(string email)
    {
        await using var connection = _context.GetConnection();
        await connection.OpenAsync();
        string sql = "SELECT * FROM app_user WHERE Email = @Email";
        User? user = (await connection.QueryAsync<User>(sql, new { Email = email })).SingleOrDefault();
        return user;
    }

    public async Task<bool> UserExistsAsync(string email)
    {
        await using var connection = _context.GetConnection();
        await connection.OpenAsync();
        string sql = "SELECT * FROM app_user WHERE Email = @Email";
        var res = (await connection.QueryAsync<User>(sql, new { Email = email }) ).ToList();
        return res.Count >= 1;
    }
}