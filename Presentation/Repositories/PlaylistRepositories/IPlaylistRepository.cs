using Presentation.PresentationDto.PlaylistDto;

namespace Presentation.Repositories.PlaylistRepositories;

public interface IPlaylistRepository
{
    Task CreatePlaylist(PlaylistToRepoDto newPlaylist);
    Task<bool> IsCanAddPlaylist(PlaylistToRepoDto newPlaylist);
}