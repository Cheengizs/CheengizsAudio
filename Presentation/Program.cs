using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Presentation;

var builder = WebApplication.CreateBuilder(args);

string connectionString = builder.Configuration.GetConnectionString("sqlServer")!;

builder.Services.AddOpenApi();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin() // allow all domains (for testing)
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddSingleton<IAudioDbContext>(new AudioDbContext(connectionString));
builder.Services.AddScoped<IMusicRepository, MusicRepository>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors();

app.MapGet("/audio/random", async (IMusicRepository MusicRepository) =>
{
    return Results.Ok(await MusicRepository.GetRandom());
});

app.MapGet("/audio/{id}", async (HttpContext context, IMusicRepository repo, int id) =>
{
    var musicObj = await repo.GetById(id);
    var filePath = musicObj.Path;

    context.Response.ContentType = "audio/mpeg";
    await context.Response.SendFileAsync(filePath);
});

app.MapPost("/audio/findByName", async (HttpContext context, IMusicRepository repo, [FromBody] MusicName name) =>
{
    var result = await repo.GetByName(name.Name);
    return result;
});

app.Run();

public record MusicName(string Name);