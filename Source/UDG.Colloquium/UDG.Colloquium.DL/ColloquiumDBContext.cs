using System.Data.Entity;
using Microsoft.AspNet.Identity.EntityFramework;
using UDG.Colloquium.DL.Custom;
using UDG.Colloquium.DL.Custom.Roles;
using UDG.Colloquium.DL.Custom.Users;
using UDG.Colloquium.DL.DBInitializers;
using UDG.Colloquium.DL.Models;
using UDG.Colloquium.DL.Repositories;

namespace UDG.Colloquium.DL
{
    public class ColloquiumDbContext : IdentityDbContext<ApplicationUser,ApplicationRole,int,ApplicationUserLogin,ApplicationUserRole,ApplicationUserClaim>
    {
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<ApplicationUser>().ToTable("Users");
            modelBuilder.Entity<ApplicationRole>().ToTable("Roles");
            modelBuilder.Entity<ApplicationUserLogin>().ToTable("UserLogins");
            modelBuilder.Entity<ApplicationUserClaim>().ToTable("UserClaims");
            modelBuilder.Entity<ApplicationUserRole>().ToTable("UserRoles");
        }

        public ColloquiumDbContext()
            : base("UDGColloquium")
        {
            Configuration.ProxyCreationEnabled = false;
            Configuration.LazyLoadingEnabled = false;
        }

        static ColloquiumDbContext()
        {
           // Database.SetInitializer(new ColloquiumDBContextInitializer());            
        }
        public DbSet<Work> Works { get; set; }
        public DbSet<Company> Companies { get; set; }
        public DbSet <Contact> Contacts { get; set; }

        public DbSet<Models.Colloquium> Colloquiums { get; set; }
    }
}