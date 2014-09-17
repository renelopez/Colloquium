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
using UDG.Colloquium.DL.Custom.Roles;
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
        public RegisterController(IRegisterRepository registerRepository)
        {
            RegisterRepository = registerRepository;
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

        [HttpGet]
        public IQueryable<ApplicationRole> Roles()
        {
            return RegisterRepository.GetRoles();
        }

        [HttpGet]
        public IQueryable<DL.Models.Colloquium> Colloquiums()
        {
            return RegisterRepository.GetColloquiums();
        }

        
    }
}
