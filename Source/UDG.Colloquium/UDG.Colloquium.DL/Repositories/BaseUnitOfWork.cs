using System.Threading.Tasks;
using UDG.Colloquium.DL.Custom;

namespace UDG.Colloquium.DL.Repositories
{
    public abstract class BaseUnitOfWork
    {
        public abstract GenericRepository<ApplicationUser> ApplicationUserRepository { get; }
        public abstract void Dispose(bool disposing);
        public abstract Task<int> SaveAsync();
    }
}