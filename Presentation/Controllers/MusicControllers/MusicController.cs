using Microsoft.AspNetCore.Mvc;
using Presentation.PresentationDto.MusicDto;
using System.IO;
using System;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

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

    [Authorize]
    [HttpPost("upload")]
    public async Task<IActionResult> UploadMusic(IFormFile file)
    {
        try
        {
            if (file == null || file.Length == 0)
                return BadRequest("Файл не выбран или пустой.");

            var uploadPath = Path.Combine(Directory.GetParent(Directory.GetCurrentDirectory()).ToString() + "\\audios");
            Console.WriteLine(uploadPath);

            string newFilePath = uploadPath + "\\" + file.FileName;
            using (var stream = new FileStream(newFilePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null)
                return Unauthorized("Не удалось получить идентификатор пользователя из токена.");

            int userId = int.Parse(userIdClaim);

            MusicToRepoDto dto = new("gay", "gay", newFilePath, userId);
            await _musicRepository.AddMusicAsync(dto);

            return Ok(new { message = "Файл успешно загружен!", fileName = file.FileName });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return StatusCode(500, "Ошибка на сервере при загрузке файла.");
        }
    }

    [HttpGet("photo/{id}")]
    public async Task<IActionResult> GetMusicPhoto(int id)
    {
        var music = await _musicRepository.GetById(id);
        if (music == null)
            return NotFound("Музыка не найдена в базе данных.");

        if (!System.IO.File.Exists(music.PhotoPath))
        {
            music.PhotoPath = Path.Combine(Directory.GetCurrentDirectory(), "null.png");
        }

        var contentType = "image/png";
        var fileName = Path.GetFileName(music.PhotoPath);

        Response.Headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
        Response.Headers["Pragma"] = "no-cache";
        Response.Headers["Expires"] = "0";

        return PhysicalFile(music.PhotoPath, contentType, fileName);
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

    [HttpPost("getList")]
    public async Task<IActionResult> GetMusicList(MusicContext context)
    {
        if (context.PlaylistId == null)
        {
            if (context.AudioId == null)
            {
                return BadRequest();
            }

            List<MusicIdResponseDto> res = new();
            var temp = await _musicRepository.GetById(context.AudioId.Value);
            var resTemp = new MusicIdResponseDto(temp.Id, temp.Title, temp.Author);
            res.Add(resTemp);
            return Ok(res);
        }
        else
        {
            List<MusicIdResponseDto> res = new List<MusicIdResponseDto>();
            var temp = await _musicRepository.GetMusicFromPlaylist(context.PlaylistId.Value);
            foreach (var elem in temp)
            {
                res.Add(new(elem.Id, elem.Title, elem.Author));
            }

            return Ok(res);
        }
    }

    [HttpGet("getFirstTrackFromPlaylist/{id}")]
    public async Task<IActionResult> GetMusicFirstTrackFromPlaylistAsync(int id)
    {
        var tempList = await _musicRepository.GetMusicFromPlaylist(id);
        var temp = tempList.FirstOrDefault();
        if (temp == null) 
            return NotFound();

        var res = new MusicIdResponseDto(temp.Id, temp.Title, temp.Author);
        return Ok(res);
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

    [HttpGet("getRandom")]
    public async Task<IActionResult> GetRandomMusic()
    {
        var elem = await _musicRepository.GetRandom();
        var res = new MusicIdResponseDto(elem.Id, elem.Title, elem.Author);
        return Ok(res);
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
        if (dto.UserId <= 0)
            return BadRequest("Invalid UserId");

        MusicToRepoDto repoDto = new MusicToRepoDto(dto.Title, dto.Author, dto.Path, dto.UserId);
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