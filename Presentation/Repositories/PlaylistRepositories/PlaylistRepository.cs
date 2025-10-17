using Dapper;
using Presentation.Models;
using Presentation.PresentationDto.PlaylistDto;

namespace Presentation.Repositories.PlaylistRepositories;

public class PlaylistRepository : IPlaylistRepository
{
    private readonly IAudioDbContext _context;

    public PlaylistRepository(IAudioDbContext context)
    {
        _context = context;
    }

    public async Task CreatePlaylist(PlaylistToRepoDto newPlaylist)
    {
        Playlist playlist = new Playlist()
        {
            Title = newPlaylist.Title,
            UserId = newPlaylist.UserId
        };

        var connection = _context.GetConnection();
        await connection.OpenAsync();

        string sql = "INSERT INTO playlist (Title, UserId) VALUES (@Title, @UserId)";
        try
        {
            await connection.ExecuteAsync(sql, playlist);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }

    public async Task<bool> IsCanAddPlaylist(PlaylistToRepoDto newPlaylist)
    {
        var connection = _context.GetConnection();
        await connection.OpenAsync();
        string sql = "SELECT COUNT(*) FROM app_user WHERE Id = @UserId";

        try
        {
            var res = await connection.QueryFirstOrDefaultAsync<int?>(sql, new { UserId = newPlaylist.UserId });
            if (res != 1) return false;
            return true;
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }
}