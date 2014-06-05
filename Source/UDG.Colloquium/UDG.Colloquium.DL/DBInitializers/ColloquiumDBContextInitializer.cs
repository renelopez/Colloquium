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
                user = new ApplicationUser { UserName = name, Email = name };
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

            base.Seed(context);
        }
    }
}
