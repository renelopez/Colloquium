using System.Linq;
using Breeze.ContextProvider;
using Breeze.ContextProvider.EF6;
using Newtonsoft.Json.Linq;
using UDG.Colloquium.DL.Custom.Users;

namespace UDG.Colloquium.DL.ServiceRepositories
{
    public class BreezeRepository:IBreezeRepository
    {
        private readonly EFContextProvider<ColloquiumDbContext>_contextProvider=new EFContextProvider<ColloquiumDbContext>();

        public string MetaData
        {
            get
            {
                return _contextProvider.Metadata();
            }
        }

        public SaveResult SaveChanges(JObject saveBundle)
        {
            return _contextProvider.SaveChanges(saveBundle);
        }

        public IQueryable<ApplicationUser> Users()
        {
            return _contextProvider.Context.Users;
        }

        public IQueryable<Work> Works()
        {
            return _contextProvider.Context.Works;
        }

        public IQueryable<Company> Companies()
        {
            return _contextProvider.Context.Companies;
        }
    }
}
