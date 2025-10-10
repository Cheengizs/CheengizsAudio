using Microsoft.AspNetCore.Http.HttpResults;

var builder = WebApplication.CreateBuilder(args);

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

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors(); // enable CORS middleware


List<Music> pl = new()
{
    new Music() { Id = 1, Title = "Cupsize yura yura", Path = @"D:\dotnet_projs\CheengizsAudio\audios\cupsize.mp3" },
    new Music() { Id = 2, Title = "Maks Corj", Path = @"D:\dotnet_projs\CheengizsAudio\audios\Макс Корж - 2 Типа Людей.mp3"}
};

app.MapGet("/", async () => Results.Ok(pl));

app.MapGet("/audio/{id}", async (HttpContext context , int id) =>
{
    var filePath = pl.Find(x => x.Id == id)?.Path;
    // var filePath = context.Request;

    context.Response.ContentType = "audio/mpeg"; // important for browsers

    await context.Response.SendFileAsync(filePath);
});

app.Run();

public class Music
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Path { get; set; }
}