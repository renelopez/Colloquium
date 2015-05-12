using System.Linq;
using System.Web.Http;
using Breeze.ContextProvider;
using Breeze.WebApi2;
using Newtonsoft.Json.Linq;
using UDG.Colloquium.DL.Custom.Roles;
using UDG.Colloquium.DL.Custom.Users;
using UDG.Colloquium.DL.Models;
using UDG.Colloquium.SL.ServiceRepositories;

namespace UDG.Colloquium.API.Controllers
{
    // Breeze Controller for simplicity?
    [BreezeController]
    [Authorize]
    public class ColloquiumController:ApiController
    {
        public IColloquiumRepository ColloquiumRepository { get; set; }
        public ColloquiumController(IColloquiumRepository colloquiumRepository)
        {
            ColloquiumRepository = colloquiumRepository;
        }

        [HttpGet]
        public string Metadata()
        {
            return ColloquiumRepository.GetMetadata();
        }

        [HttpPost]        
        public SaveResult SaveChanges(JObject saveBundle)
        {
            return ColloquiumRepository.SaveChanges(saveBundle);
        }

        [HttpGet]
        public IQueryable<ApplicationUser> Users()
        {
            return ColloquiumRepository.GetUsers();
        }

        [HttpGet]
        public IQueryable<Work> Works()
        {
            return ColloquiumRepository.GetWorks();
        }

        [HttpGet]
        public IQueryable<Company> Companies()
        {
            return ColloquiumRepository.GetCompanies();
        }

        [HttpGet]
        public IQueryable<Contact> Contacts()
        {
            return ColloquiumRepository.GetContacts();
        }

        [HttpGet]
        public IQueryable<ApplicationRole> Roles()
        {
            return ColloquiumRepository.GetRoles();
        }

        [HttpGet]
        public IQueryable<DL.Models.Colloquium> Colloquiums()
        {
            return ColloquiumRepository.GetColloquiums();
        }

        [HttpGet]
        public IQueryable<Session> Sessions()
        {
            return ColloquiumRepository.GetSessions();
        }

        [HttpGet]
        public IQueryable<Comment> Comments()
        {
            return ColloquiumRepository.GetComments();
        }

        
    }
}
