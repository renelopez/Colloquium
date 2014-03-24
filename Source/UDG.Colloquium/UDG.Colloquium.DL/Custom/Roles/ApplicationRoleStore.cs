using Microsoft.AspNet.Identity.EntityFramework;
using UDG.Colloquium.DL.Custom.Users;

namespace UDG.Colloquium.DL.Custom.Roles
{
    public class ApplicationRoleStore : RoleStore<ApplicationRole, int, ApplicationUserRole>
    {
        public ApplicationRoleStore(ColloquiumDbContext context)
            : base(context)
        {
        }
    }
}