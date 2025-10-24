using Microsoft.Data.SqlClient;

namespace Presentation;

public interface IAudioDbContext
{
    SqlConnection GetConnection();
}