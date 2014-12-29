using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Owin.Security.OAuth;
using UDG.Colloquium.BL.Contracts.Identity;
using UDG.Colloquium.BL.Managers.Identity;
using UDG.Colloquium.DL.Custom.Users;

namespace UDG.Colloquium.SL.Providers
{
    public class SimpleAuthorizationServerProvider : OAuthAuthorizationServerProvider
    {
        public ISecurityUserManager SecurityUserManager { get; set; }
        public SimpleAuthorizationServerProvider(ISecurityUserManager securityUserManager)
        {
            SecurityUserManager = securityUserManager;
        }
        public override async Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
        {
           context.Validated();
        }

        public override async Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
        {
            try
            {
                context.OwinContext.Response.Headers.Add("Access-Control-Allow-Origin", new[] {"*"});
                ApplicationUser user = await SecurityUserManager.FindUserAsync(context.UserName, context.Password);

                if (user == null)
                {
                    context.SetError("invalid_grant", "The user name or password is incorrect.");
                    return;
                }


                var identity = new ClaimsIdentity(context.Options.AuthenticationType);
                identity.AddClaim(new Claim("sub", context.UserName));
                identity.AddClaim(new Claim("role", "user"));
                context.Validated(identity);
            }
            catch (Exception)
            {
                
            }
        }
    }
}
