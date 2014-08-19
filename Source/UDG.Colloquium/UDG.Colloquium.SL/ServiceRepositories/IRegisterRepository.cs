using System.Linq;
using System.Security.Principal;
using Breeze.ContextProvider;
using Newtonsoft.Json.Linq;
using UDG.Colloquium.DL.Custom.Roles;
using UDG.Colloquium.DL.Custom.Users;
using UDG.Colloquium.DL.Models;

namespace UDG.Colloquium.SL.ServiceRepositories
{
    public interface IRegisterRepository
    {
        string GetMetadata();
        IQueryable<ApplicationUser> GetUsers();
        IQueryable<ApplicationRole> GetRoles();
        IQueryable<Work> GetWorks();
        IQueryable<Company> GetCompanies();
        SaveResult SaveChanges(JObject saveBundle);
        IQueryable<Contact> GetContacts();

    }
}
