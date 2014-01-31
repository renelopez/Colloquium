using Microsoft.AspNet.Identity.EntityFramework;

namespace UDG.Colloquium.DL.Custom
{
    public class ApplicationUserStore:UserStore<ApplicationUser>
    {
        public ApplicationUserStore(SecurityDbContext context)
            :base(context)
        {

        }
        
    }
}
