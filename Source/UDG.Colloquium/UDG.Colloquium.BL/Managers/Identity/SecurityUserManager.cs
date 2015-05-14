using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using UDG.Colloquium.BL.Contracts.Identity;
using UDG.Colloquium.DL.Custom.Users;
using UDG.Colloquium.DL.Repositories;

namespace UDG.Colloquium.BL.Managers.Identity
{
    public class SecurityUserManager:UserManager<ApplicationUser,int>, ISecurityUserManager
    {
        public IUnitOfWork UnitOfWork { get; set; }
        public IUserStore<ApplicationUser,int> UserStore { get; set; }


        public SecurityUserManager(IUserStore<ApplicationUser, int> userStore,IUnitOfWork unitOfWork)
            : base(userStore)
        {
            UnitOfWork = unitOfWork;
            UserStore = userStore;
        }

        public void Clean()
        {
            Dispose();
        }

      

        public async Task<ApplicationUser> FindUserAsync(string user, string password)
        {
            return await FindAsync(user, password);
        }

     
    }
}