using System.Data.Entity;
using Microsoft.AspNet.Identity.EntityFramework;
using UDG.Colloquium.DL.Custom.Users;

namespace UDG.Colloquium.DL.Custom.Roles
{
    public class ApplicationRoleStore : RoleStore<ApplicationRole, int, ApplicationUserRole>
    {
        public ApplicationRoleStore(DbContext context)
            : base(context)
        {
        }
    }
}