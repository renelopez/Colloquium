using Microsoft.AspNet.Identity.EntityFramework;

namespace UDG.Colloquium.DL.Custom
{
    public class ApplicationRoleStore:RoleStore<ApplicationRole>
    {
        public ApplicationRoleStore(SecurityDbContext context)
            : base(context)
        {
            
        }
    }
}
