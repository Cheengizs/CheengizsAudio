using Microsoft.AspNetCore.Mvc;
using Presentation.PresentationDto.MusicDto;
using System.IO;
using System;

namespace Presentation.Controllers.MusicControllers;

[Route("/api/v1/audio")]
[ApiController]
public class MusicController : ControllerBase
{
    private readonly IMusicRepository _musicRepository;

    public MusicController(IMusicRepository musicRepository)
    {
        _musicRepository = musicRepository;
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetMusicByIdAsync(int id)
    {
        try
        {
            var music = await _musicRepository.GetById(id);

            if (music == null)
                return NotFound();
            
            var res = new MusicResponseDto(music.Title, music.Author);
            return Ok(res);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return BadRequest(e.Message);
        }
    }

    [HttpGet("download/{id}")]
    public async Task<IActionResult> DownloadMusicByIdAsync(int id)
    {
        var music = await _musicRepository.GetById(id);
        if (music == null)
            return NotFound("Музыка не найдена в базе данных.");

        if (!System.IO.File.Exists(music.Path))
            return NotFound("Файл не найден на диске.");

        // Определяем MIME-тип (например, для mp3)
        var contentType = "audio/mpeg";
        var fileName = Path.GetFileName(music.Path);

        // Возвращаем файл клиенту
        return PhysicalFile(music.Path, contentType, fileName);
    }

    [HttpPost]
    public async Task<IActionResult> AddNewTrack([FromBody] MusicRequestDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Title))
            return BadRequest("Title is required");
        if (string.IsNullOrWhiteSpace(dto.Path))
            return BadRequest("Path is required");
        if (string.IsNullOrWhiteSpace(dto.Author))
            return BadRequest("Author is required");

        MusicToRepoDto repoDto = new MusicToRepoDto(dto.Title, dto.Author, dto.Path);
        try
        {
            await _musicRepository.AddMusicAsync(repoDto);
            return Created();
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return BadRequest($"Some exception happened:" + e.Message);
        }
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteMusicByIdAsync(int id)
    {
        await _musicRepository.DeleteMusicByIdAsync(id);
        return NoContent();
    }

    [HttpDelete("{title}")]
    public async Task<IActionResult> DeleteMusicByTitleAsync(string title)
    {
        await _musicRepository.DeleteMusicByTitleAsync(title);
        return NoContent();
    }
}