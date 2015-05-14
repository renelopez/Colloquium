using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using Microsoft.AspNet.Identity;
using UDG.Colloquium.DL.Custom.Roles;
using UDG.Colloquium.DL.Custom.Users;

namespace UDG.Colloquium.DL.DBInitializers
{
    public class ColloquiumDBContextInitializer:DropCreateDatabaseAlways<ColloquiumDbContext>
    {
        UserManager<ApplicationUser, int> userManager;
        RoleManager<ApplicationRole, int> roleManager;

        protected override void Seed(ColloquiumDbContext context)
        {
            userManager = new UserManager<ApplicationUser, int>(new ApplicationUserStore(context));
            roleManager = new RoleManager<ApplicationRole, int>(new ApplicationRoleStore(context));

            var users=new List<string>()
            {
                "renelopezcano",
                "renerene",
                "viriloca",
                "viriviri"
            };
            var roles =new List<string> {"Administrator","Student","Teacher"};

            roles.ForEach(roleName =>
            {
                //Create Role Admin if it does not exist
                var role = roleManager.FindByName(roleName);
                if (role != null) return;
                role = new ApplicationRole(roleName) {IsActive = true};
                var roleresult = roleManager.Create(role);
            });


            for (var i = 0; i < users.Count; i++)
            {
                if (i%2 != 0) continue;
                var tempUser = userManager.FindByName(users.ElementAt(i)) ??
                               addUser(users.ElementAt(i), users.ElementAt(i + 1));
                addAdminRoleToUser(tempUser);
            }

            userManager.Dispose();
            roleManager.Dispose();

            base.Seed(context);
        }

        private void addAdminRoleToUser(ApplicationUser user)
        {
            // Add user admin to Role Admin if not already added
            var rolesForUser = userManager.GetRoles(user.Id);
            if (!rolesForUser.Contains("Administrator"))
            {
                var result = userManager.AddToRole(user.Id, "Administrator");
            }
        }

        private ApplicationUser addUser(string username, string password)
        {
            var user = new ApplicationUser {UserName = username, Email = username, LastName = "testLast" + username, FirstName = "testFirst" + username, BirthDate = DateTime.Now, BirthPlace = "Mexico", Genre = ApplicationUser.UserGenre.Male, Nacionality = "Mexican", IsActive = true};
            var result = userManager.Create(user, password);
                result = userManager.SetLockoutEnabled(user.Id, false);
            return user;
        }


    }
}
