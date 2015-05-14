using System.Threading.Tasks;
using UDG.Colloquium.DL.Custom.Users;

namespace UDG.Colloquium.BL.Contracts.Identity
{
    public interface ISecurityUserManager
    {
       
        Task<ApplicationUser> FindUserAsync(string user, string password);

    }
}