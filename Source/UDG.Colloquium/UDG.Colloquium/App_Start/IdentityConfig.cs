using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNet.Identity;
using Microsoft.Owin.Security;
using UDG.Colloquium.BL.Managers;
using UDG.Colloquium.DL.Custom.Users;

namespace UDG.Colloquium.App_Start
{
    public class SignInHelper
    {
        public SecurityUserManager UserManager { get; private set; }
        public IAuthenticationManager AuthenticationManager { get; private set; }

        public SignInHelper(SecurityUserManager userManager, IAuthenticationManager authenticationManager)
        {
            UserManager = userManager;
            AuthenticationManager = authenticationManager;
        }

         public async Task SignInAsync(ApplicationUser user, bool isPersistent)
        {
            AuthenticationManager.SignOut(DefaultAuthenticationTypes.ExternalCookie);
            var identity = await UserManager.CreateIdentityAsync(user, DefaultAuthenticationTypes.ApplicationCookie);
            AuthenticationManager.SignIn(new AuthenticationProperties() { IsPersistent = isPersistent }, identity);
        }
    }
}