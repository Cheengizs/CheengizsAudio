using Dapper;
using Presentation.PresentationDto.MusicDto;

namespace Presentation;

public class MusicRepository : IMusicRepository
{
    private readonly IAudioDbContext _context;

    public MusicRepository(IAudioDbContext dbContext)
    {
        _context = dbContext;
    }

    public async Task<List<MusicResponseDto>> GetByName(string name)
    {
        try
        {
            await using var connection = _context.GetConnection();
            connection.Open();

            var sql = @"SELECT * FROM dbo.music";

            var musics = connection.Query<Music>(sql).ToList();
            musics = musics.Where(m => Fastenshtein.Levenshtein.Distance(m.Title, name) <= 5).ToList();
            
            List<MusicResponseDto> res = new List<MusicResponseDto>();
            foreach (var music in musics)
            {
                res.Add(new(music.Title, music.Author));
            }
            return res;
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }

    public async Task<MusicResponseDto?> GetById(int id)
    {
        await using var connection = _context.GetConnection();
        connection.Open();
        var sql = @"SELECT * FROM music WHERE id = @id";
        var music = connection.Query<Music>(sql, new { id }).FirstOrDefault();
        if (music == null)
            return null;
        
        var res = new MusicResponseDto(music.Title, music.Author);
        return res;
    }

    public async Task<int> GetRandom()
    {
        await using var connection = _context.GetConnection();
        connection.Open();
        var sql = @"SELECT * FROM dbo.music";
        var list = connection.Query<Music>(sql).ToList();
        var x = new Random().Next(list.Count);
        return list[x].Id;
    }

    public async Task AddMusicAsync(MusicToRepoDto music)
    {
        Music musicToAdd = new Music()
        {
            Title = music.Title,
            Author = music.Author,
            Path = music.Path
        };

        await using var connection = _context.GetConnection();
        connection.Open();

        string sql = @"INSERT INTO dbo.music (Title, Author, Path) VALUES (@Title, @Author, @Path)";
        try
        {
            await connection.ExecuteAsync(sql, musicToAdd);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }

    public async Task DeleteMusicByIdAsync(int id)
    {
        await using var connection = _context.GetConnection();
        connection.Open();
        var sql = @"DELETE FROM dbo.music WHERE id = @id";
        try
        {
            await connection.ExecuteAsync(sql, new { id = id });
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }

    public async Task DeleteMusicByTitleAsync(string title)
    {
        await using var connection = _context.GetConnection();
        connection.Open();
        var sql = @"DELETE FROM dbo.music WHERE Title = @title";
        
        try
        {
            await connection.ExecuteAsync(sql, new { title = title });
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }
}