using System;
using System.Linq;
using System.Security.Claims;
using System.Web;
using System.Web.Http;
using Breeze.ContextProvider;
using Breeze.WebApi2;
using Microsoft.Owin.Infrastructure;
using Microsoft.Owin.Security;
using Newtonsoft.Json.Linq;
using UDG.Colloquium.BL.Contracts.Identity;
using UDG.Colloquium.BL.ViewModels.Account.Register;
using UDG.Colloquium.DL.Custom.Users;
using UDG.Colloquium.DL.Models;
using UDG.Colloquium.SL.ServiceRepositories;

namespace UDG.Colloquium.SL
{
    [BreezeController]
    [Authorize]
    public class RegisterController:ApiController
    {
        public IRegisterRepository RegisterRepository { get; set; }
        public ISecurityUserManager UserManager { get; set; }
        public RegisterController(IRegisterRepository registerRepository,ISecurityUserManager userManager)
        {
            RegisterRepository = registerRepository;
            UserManager = userManager;
        }

        [HttpGet]
        public string Metadata()
        {
            return RegisterRepository.GetMetadata();
        }

        [HttpPost]        
        public SaveResult SaveChanges(JObject saveBundle)
        {
            return RegisterRepository.SaveChanges(saveBundle);
        }

        [HttpGet]
        public IQueryable<ApplicationUser> Users()
        {
            return RegisterRepository.GetUsers();
        }

        [HttpGet]
        public IQueryable<Work> Works()
        {
            return RegisterRepository.GetWorks();
        }

        [HttpGet]
        public IQueryable<Company> Companies()
        {
            return RegisterRepository.GetCompanies();
        }

        [HttpGet]
        public IQueryable<Contact> Contacts()
        {
            return RegisterRepository.GetContacts();
        }

        [HttpPost]
        [AllowAnonymous]
        public string Authenticate(LoginVm loginInfo)
        {
            if (string.IsNullOrEmpty(loginInfo.UserName) || string.IsNullOrEmpty(loginInfo.Password))
                return "failed";
            var userIdentity = UserManager.FindUserAsync(loginInfo.UserName, loginInfo.Password).Result;
            if (userIdentity != null)
            {
                var identity = new ClaimsIdentity(Startup.OAuthBearerOptions.AuthenticationType);
                identity.AddClaim(new Claim(ClaimTypes.Name, loginInfo.UserName));
                identity.AddClaim(new Claim(ClaimTypes.NameIdentifier, userIdentity.Id.ToString()));
                var ticket = new AuthenticationTicket(identity, new AuthenticationProperties());
                var currentUtc = new SystemClock().UtcNow;
                ticket.Properties.IssuedUtc = currentUtc;
                ticket.Properties.ExpiresUtc = currentUtc.Add(TimeSpan.FromMinutes(30));
                string accessToken = Startup.OAuthBearerOptions.AccessTokenFormat.Protect(ticket);
                return accessToken;
            }
            return "failed";
        }
    }
}
