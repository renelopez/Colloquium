using System;
using System.Collections.Generic;
using System.Data.Entity;
using Microsoft.AspNet.Identity;
using UDG.Colloquium.DL.Custom.Roles;
using UDG.Colloquium.DL.Custom.Users;

namespace UDG.Colloquium.DL.DBInitializers
{
    public class ColloquiumDBContextInitializer:DropCreateDatabaseAlways<ColloquiumDbContext>
    {
        protected override void Seed(ColloquiumDbContext context)
        {
            var userManager = new UserManager<ApplicationUser, int>(new ApplicationUserStore(context));
            var roleManager = new RoleManager<ApplicationRole, int>(new ApplicationRoleStore(context));
            const string name = "renelopezcano";
            const string password = "renerene";
            var roles =new List<string> {"Administrator","Student","Teacher"};

            roles.ForEach(roleName =>
            {
                //Create Role Admin if it does not exist
                var role = roleManager.FindByName(roleName);
                if (role != null) return;
                role = new ApplicationRole(roleName);
                role.IsActive = true;
                var roleresult = roleManager.Create(role);
            });


           

            var user = userManager.FindByName(name);
            if (user == null)
            {
                user = new ApplicationUser { UserName = name, Email = name,LastName = "Lopez" ,FirstName = "Robben",BirthDate = DateTime.Now ,BirthPlace = "Mexico",Genre = ApplicationUser.UserGenre.Male,Nacionality = "Mexican",IsActive = true};
                var result = userManager.Create(user, password);
                result = userManager.SetLockoutEnabled(user.Id, false);
            }

            // Add user admin to Role Admin if not already added
            var rolesForUser = userManager.GetRoles(user.Id);
            if (!rolesForUser.Contains("Administrator"))
            {
                var result = userManager.AddToRole(user.Id, "Administrator");
            }

            userManager.Dispose();
            roleManager.Dispose();

            base.Seed(context);
        }
    }
}
