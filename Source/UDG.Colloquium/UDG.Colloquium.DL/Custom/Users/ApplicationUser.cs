using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;

namespace UDG.Colloquium.DL.Custom.Users
{
    public class ApplicationUser : IdentityUser<int,ApplicationUserLogin,ApplicationUserRole,ApplicationUserClaim>
    {

    }
}
