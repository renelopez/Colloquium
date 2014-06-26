using System.Linq;
using System.Web.Http;
using Breeze.ContextProvider;
using Breeze.WebApi2;
using Newtonsoft.Json.Linq;
using UDG.Colloquium.BL.ViewModels.Account.DTO;
using UDG.Colloquium.SL.ServiceRepositories;

namespace UDG.Colloquium.SL
{
   // [Authorize]
    [BreezeController]
    public class RegisterController:ApiController
    {
        public IBreezeRepository BreezeRepository { get; set; }
        public RegisterController(IBreezeRepository breezeRepository)
        {
            BreezeRepository = breezeRepository;
        }

        [HttpGet]
        public string Metadata()
        {
            return BreezeRepository.GetMetaData;
        }

        [HttpPost]
        public SaveResult SaveChanges(JObject saveBundle)
        {
            return BreezeRepository.SaveChanges(saveBundle);
        }

        [HttpGet]
        public IQueryable<User> Users()
        {
            return BreezeRepository.Users();
        }

        [HttpGet]
        public IQueryable<Work> Works()
        {
            return BreezeRepository.Works();
        }

        [HttpGet]
        public IQueryable<Company> Companies()
        {
            return BreezeRepository.Companies();
        }

       


    }
}
