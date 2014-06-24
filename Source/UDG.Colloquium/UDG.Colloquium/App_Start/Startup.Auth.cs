using System;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin;
using Microsoft.Owin.Security.Cookies;
using Owin;
using UDG.Colloquium.BL.Contracts.Identity;
using UDG.Colloquium.BL.Managers.Identity;

namespace UDG.Colloquium.App_Start
{
    public partial class Startup
    {
        // For more information on configuring authentication, please visit http://go.microsoft.com/fwlink/?LinkId=301864

        public void ConfigureAuth(IAppBuilder app)
        {
            //// Configure the db context, user manager and role manager to use a single instance per request
            //app.CreatePerOwinContext(ColloquiumDbContext.Create);
            //app.CreatePerOwinContext<SecurityUserManager>(SecurityUserManager.GetSecurityManager);
            //app.CreatePerOwinContext<SecurityRoleManager>(SecurityRoleManager.Create);


            // Enable the application to use a cookie to store information for the signed in user
            app.UseCookieAuthentication(new CookieAuthenticationOptions
            {
                AuthenticationType = DefaultAuthenticationTypes.ApplicationCookie,
                LoginPath = new PathString("/Account/Login")
            });
            // Use a cookie to temporarily store information about a user logging in with a third party login provider
            app.UseExternalSignInCookie(DefaultAuthenticationTypes.ExternalCookie);
        }




    }
}