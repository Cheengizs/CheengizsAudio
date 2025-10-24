using Microsoft.Data.SqlClient;

namespace Presentation;

public class AudioDbContext : IAudioDbContext
{
    private readonly string _connectionString;
    
    public AudioDbContext(string connectionString)
    {
        _connectionString = connectionString;
    }

    public SqlConnection GetConnection()
    {
        return new SqlConnection(_connectionString);
    }
}