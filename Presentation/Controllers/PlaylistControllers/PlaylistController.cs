using Microsoft.AspNetCore.Mvc;
using Presentation.Models;
using Presentation.PresentationDto.PlaylistDto;
using Presentation.Repositories.PlaylistRepositories;

namespace Presentation.Controllers.PlaylistControllers;

[ApiController]
[Route("/api/v1/playlist")]
public class PlaylistController : ControllerBase
{
    private readonly IPlaylistRepository _playlistRepository;

    public PlaylistController(IPlaylistRepository playlistRepository)
    {
        _playlistRepository = playlistRepository;
    }

    [HttpPost]
    public async Task<IActionResult> CreatePlaylist([FromBody] PlaylistCreateRequestDto dto)
    {
        PlaylistToRepoDto newPlaylist = new PlaylistToRepoDto(dto.Title, dto.UserId);
        if (!(await _playlistRepository.IsCanAddPlaylist(newPlaylist)))
        {
            return NotFound("User was not found");
        }
        
        try
        {
            await _playlistRepository.CreatePlaylist(newPlaylist);
            return Created();
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return BadRequest(e.Message);
        }
    }
}