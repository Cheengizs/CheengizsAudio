using Presentation.PresentationDto.MusicDto;

namespace Presentation;

public interface IMusicRepository
{
    Task<List<Music>> GetByName(string name);
    Task<Music?> GetById(int id);
    Task<int> GetRandom();
    Task AddMusicAsync(MusicToRepoDto music);
    Task DeleteMusicByIdAsync(int id);
    Task DeleteMusicByTitleAsync(string title);
}