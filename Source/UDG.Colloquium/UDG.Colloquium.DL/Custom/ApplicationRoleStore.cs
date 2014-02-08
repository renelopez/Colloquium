using System.Data.Entity;
using Microsoft.AspNet.Identity.EntityFramework;

namespace UDG.Colloquium.DL.Custom
{
    public class ApplicationRoleStore:RoleStore<ApplicationRole>
    {
        public ApplicationRoleStore(IdentityDbContext context)
            : base(context)
        {
            
        }
    }
}
