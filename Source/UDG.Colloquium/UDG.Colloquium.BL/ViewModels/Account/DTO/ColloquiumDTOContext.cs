using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UDG.Colloquium.BL.ViewModels.Account.DTO
{
    public class ColloquiumDTOContext : DbContext
    {
        static ColloquiumDTOContext()
        {
            // Prevent attempt to initialize a database for this context
            Database.SetInitializer<ColloquiumDTOContext>(null);
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Work> Works { get; set; }
        public DbSet<Company> Companies { get; set; }   
    }

}
