namespace Presentation;

public interface IMusicRepository
{
    Task<List<Music>> GetByName(string name);
    Task<Music?> GetById(int id);
    Task<int> GetRandom();
}