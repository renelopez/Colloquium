using Microsoft.AspNet.Identity;
using UDG.Colloquium.DL.Custom.Roles;
using UDG.Colloquium.DL.Custom.Users;

namespace UDG.Colloquium.DL.Migrations
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<UDG.Colloquium.DL.ColloquiumDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(UDG.Colloquium.DL.ColloquiumDbContext context)
        {
            var userManager = new UserManager<ApplicationUser, int>(new ApplicationUserStore(context));
            var roleManager = new RoleManager<ApplicationRole, int>(new ApplicationRoleStore(context));
            const string name = "renelopezcano";
            const string password = "renerene";
            const string roleName = "Administrator";

            //Create Role Admin if it does not exist
            var role = roleManager.FindByName(roleName);
            if (role == null)
            {
                role = new ApplicationRole(roleName);
                var roleresult = roleManager.Create(role);
            }

            var user = userManager.FindByName(name);
            if (user == null)
            {
                user = new ApplicationUser { UserName = name, Email = name, LastName = "Lopez", FirstName = "Robben", BirthDate = DateTime.Now, BirthPlace = "Mexico", Genre = ApplicationUser.UserGenre.Male, Nacionality = "Mexican",ColloquiumId = 1};

                // Registering to colloquium
                var col = new Models.Colloquium { BeginDate = DateTime.Now, EndDate = DateTime.Now.AddDays(1), Period = "2014B", Id = 1 };
                context.Colloquiums.Add(col);
                user.Colloquiums.Add(col);

                // Adding user to DB.
                var result = userManager.Create(user, password);
                result = userManager.SetLockoutEnabled(user.Id, false);
            }

            // Add user admin to Role Admin if not already added
            var rolesForUser = userManager.GetRoles(user.Id);
            if (!rolesForUser.Contains(role.Name))
            {
                var result = userManager.AddToRole(user.Id, role.Name);
            }

            userManager.Dispose();
            roleManager.Dispose();
        }
    }
}
