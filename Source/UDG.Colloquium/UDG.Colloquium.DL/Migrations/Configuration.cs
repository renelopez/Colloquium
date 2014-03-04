using Microsoft.AspNet.Identity.EntityFramework;

namespace UDG.Colloquium.DL.Migrations
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<ColloquiumDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(ColloquiumDbContext context)
        {
            //  This method will be called after migrating to the latest version.

            //  You can use the DbSet<T>.AddOrUpdate() helper extension method 
            //  to avoid creating duplicate seed data. E.g.
            //
            //    context.People.AddOrUpdate(
            //      p => p.FullName,
            //      new Person { FullName = "Andrew Peters" },
            //      new Person { FullName = "Brice Lambson" },
            //      new Person { FullName = "Rowan Miller" }
            //    );
            //

            if (!context.Roles.Any(rol => rol.Name == "Administrator"))
            {
                context.Roles.AddOrUpdate(new IdentityRole { Name = "Administrator" });
            }

            if (!context.Users.Any(usr => usr.UserName == "renelopez"))
            {
                context.Users.AddOrUpdate(new IdentityUser { UserName = "renelopez" });
            }

            var user = context.Users.FirstOrDefault(usr => usr.UserName == "renelopez");
            if (user == null || user.Roles.Any(usr => usr.Role.Name == "Administrator")) return;
            var role = context.Roles.First(rol => rol.Name == "Administrator");
            user.Roles.Add(new IdentityUserRole { Role = role, RoleId = role.Id, User = user, UserId = user.Id });
            context.SaveChanges();
        }
    }
}
