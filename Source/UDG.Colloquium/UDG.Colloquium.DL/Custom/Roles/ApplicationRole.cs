using Microsoft.AspNet.Identity.EntityFramework;
using UDG.Colloquium.DL.Custom.Users;

namespace UDG.Colloquium.DL.Custom.Roles
{
    public class ApplicationRole:IdentityRole<int,ApplicationUserRole>
    {
        public string Description { get; set; }
        public bool IsActive { get; set; }
        public ApplicationRole() { }

        public ApplicationRole(string roleName)
        {
            Name = roleName;
        }
    }
}
