using System.Linq;
using Breeze.ContextProvider;
using Newtonsoft.Json.Linq;
using UDG.Colloquium.DL.Custom.Users;
using UDG.Colloquium.DL.Models;

namespace UDG.Colloquium.DL.ServiceRepositories
{
    public interface IBreezeRepository
    {
        string MetaData { get; }
        SaveResult SaveChanges(JObject saveBundle);
        IQueryable<ApplicationUser> Users();

        IQueryable<Work> Works();

        IQueryable<Company> Companies();
    }
}
