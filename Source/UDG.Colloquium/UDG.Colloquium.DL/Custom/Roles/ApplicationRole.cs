using Microsoft.AspNet.Identity.EntityFramework;
using UDG.Colloquium.DL.Custom.Users;

namespace UDG.Colloquium.DL.Custom.Roles
{
    public class ApplicationRole:IdentityRole<int,ApplicationUserRole>
    {
        public ApplicationRole() { }

        public ApplicationRole(string roleName)
        {
            Name = roleName;
        }
    }
}
