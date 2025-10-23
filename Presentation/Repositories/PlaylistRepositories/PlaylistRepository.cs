using Dapper;
using Microsoft.AspNetCore.Http.HttpResults;
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

    public async Task AddTrackToPlaylist(TrackToPlaylist newTrack)
    {
        await using var connection = _context.GetConnection();
        await connection.OpenAsync();
        string sql = @"INSERT INTO dbo.music_playlist (music_id, playlist_id) VALUES (@AudioId, @PlaylistId)";

        try
        {
            await connection.ExecuteAsync(sql, newTrack);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }

    public async Task<Playlist> GetRandom()
    {
        await using var connection = _context.GetConnection();
        await connection.OpenAsync();
        string sql = "SELECT * FROM dbo.playlist";
        try
        {
            var resList = (await connection.QueryAsync<Playlist>(sql)).ToList();
            var res = resList[new Random().Next(0, resList.Count)];
            return res;
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }

    public async Task<string> GetPlaylistUsername(int id)
    {
        await using var connection = _context.GetConnection();
        await connection.OpenAsync();
        string sql = "SELECT * FROM dbo.app_user WHERE Id = @Id";
        try
        {
            var res = await connection.QueryFirstOrDefaultAsync<User>(sql, new { Id = id });
            
            return res==null ? "Unknown artist lol back" : res.Username;
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }
}