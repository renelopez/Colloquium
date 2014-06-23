using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using Breeze.ContextProvider;
using Breeze.WebApi2;
using Newtonsoft.Json.Linq;
using UDG.Colloquium.DL;
using UDG.Colloquium.DL.Custom.Users;
using UDG.Colloquium.DL.Models;
using UDG.Colloquium.DL.ServiceRepositories;

namespace UDG.Colloquium.SL
{
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
            return BreezeRepository.MetaData;
        }

        [HttpPost]
        public SaveResult SaveChanges(JObject saveBundle)
        {
            return BreezeRepository.SaveChanges(saveBundle);
        }

        [HttpGet]
        public IQueryable<ApplicationUser> Users()
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
