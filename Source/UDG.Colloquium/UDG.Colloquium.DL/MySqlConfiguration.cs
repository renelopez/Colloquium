using System.Data.Entity;

namespace UDG.Colloquium.DL
{
    public class MySqlConfiguration:DbConfiguration
    {
        public MySqlConfiguration()
        {
            SetHistoryContext(
            "MySql.Data.MySqlClient", (conn, schema) => new MySqlHistoryContext(conn, schema));
        }
    }
}
