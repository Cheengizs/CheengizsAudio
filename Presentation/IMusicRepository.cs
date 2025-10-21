using Presentation.PresentationDto.MusicDto;

namespace Presentation;

public interface IMusicRepository
{
    Task<List<MusicResponseDto>> GetByName(string name);
    Task<Music?> GetById(int id);
    Task<Music> GetRandom();
    Task AddMusicAsync(MusicToRepoDto music);
    Task DeleteMusicByIdAsync(int id);
    Task DeleteMusicByTitleAsync(string title);
    Task <List<Music>> GetMusicFromPlaylist(int playlistId);
}