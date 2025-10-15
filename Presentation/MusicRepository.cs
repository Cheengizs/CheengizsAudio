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

    public async Task<List<Music>> GetByName(string name)
    {
        try
        {
            using var connection = _context.GetConnection();
            connection.Open();

            var sql = @"SELECT * FROM dbo.music";

            var musics = connection.Query<Music>(sql).ToList();
            var res = musics.Where(m => Fastenshtein.Levenshtein.Distance(m.Title, name) <= 5).ToList();
            return res;
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }

    public async Task<Music?> GetById(int id)
    {
        using var connection = _context.GetConnection();
        connection.Open();
        var sql = @"SELECT * FROM music WHERE id = @id";
        var music = connection.Query<Music>(sql, new { id }).FirstOrDefault();
        return music;
    }

    public async Task<int> GetRandom()
    {
        using var connection = _context.GetConnection();
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
}