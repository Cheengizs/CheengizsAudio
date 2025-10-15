using Microsoft.AspNetCore.Mvc;
using Presentation.Models;
using Presentation.PresentationDto.UserDto;
using Presentation.Repositories.UserRepositories;
using Presentation.Services;
using Presentation.Services.JwtServicies;

namespace Presentation.Controllers.UserControllers;

[ApiController]
[Route("/api/v1")]
public class UserController : ControllerBase
{
    private readonly IUserRepository _userRepository;
    private readonly IUserPasswordHasher _userPasswordHasher;
    private readonly IJwtService _jwtService;
    public UserController(IUserRepository userRepository, IUserPasswordHasher userPasswordHasher, IJwtService jwtService)
    {
        _userRepository = userRepository;
        _userPasswordHasher = userPasswordHasher;
        _jwtService = jwtService;
    }

    [HttpPost("auth/register")]
    public async Task<IActionResult> CreateUser([FromBody] UserRegisterRequestDto dto)
    {
        string hashedPassword = _userPasswordHasher.HashPassword(dto.Password);
        UserToRepoDto newUser = new UserToRepoDto(dto.Username, hashedPassword, dto.Email);
        try
        {
            await _userRepository.AddUserAsync(newUser);
            return Created();
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return BadRequest(e.Message);
        }
    }

    [HttpPost("auth/login")]
    public async Task<IActionResult> LoginUser([FromBody] UserLoginRequestDto dto)
    {
        var user = await _userRepository.GetUserByEmailAsync(dto.Email);
        
        if (user == null)
            return Unauthorized("Invalid email or password");

        if (!_userPasswordHasher.VerifyPassword(dto.Password, user.HashPassword))
            return Unauthorized("Invalid email or password");
        
        var userToJwtDto = new UserToJwtDto(user.Id, user.Username, user.Email);
        return Ok(await _jwtService.GenerateJwtAsync(userToJwtDto));
        
    }
}