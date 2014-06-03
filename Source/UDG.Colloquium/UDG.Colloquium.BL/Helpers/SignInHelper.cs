using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Microsoft.Owin.Security;
using UDG.Colloquium.BL.Managers;
using UDG.Colloquium.DL.Custom.Users;

namespace UDG.Colloquium.BL.Helpers
{
    public class SignInHelper
    {
        public SecurityUserManager UserManager { get; private set; }

        public SignInHelper(SecurityUserManager userManager)
        {
            UserManager = userManager;
        }

         public async Task SignInAsync(IAuthenticationManager authManager,ApplicationUser user, bool isPersistent)
        {
            authManager.SignOut(DefaultAuthenticationTypes.ExternalCookie);
            var identity = await UserManager.CreateIdentityAsync(user, DefaultAuthenticationTypes.ApplicationCookie);
            authManager.SignIn(new AuthenticationProperties() { IsPersistent = isPersistent }, identity);
        }
    }
}