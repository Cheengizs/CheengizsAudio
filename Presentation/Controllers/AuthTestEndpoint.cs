using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Presentation.Controllers;

[ApiController]
[Route("/api/v1/auth/test")]
public class AuthTestEndpoint : ControllerBase
{
    [HttpGet]
    [Authorize]
    public SecretInformation SecretInformationMethod()
    {
        return new SecretInformation(DateTime.UtcNow.AddDays(-7), "JOPA DANIKA");
    }
}

public record SecretInformation(DateTime DateAndTime, string Information);