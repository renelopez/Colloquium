using System.Linq;
using System.Web;
using System.Web.Http;
using Breeze.ContextProvider;
using Breeze.WebApi2;
using Newtonsoft.Json.Linq;
using UDG.Colloquium.DL.Custom.Users;
using UDG.Colloquium.DL.Models;
using UDG.Colloquium.SL.ServiceRepositories;

namespace UDG.Colloquium.SL
{
    [BreezeController]
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
    }
}
