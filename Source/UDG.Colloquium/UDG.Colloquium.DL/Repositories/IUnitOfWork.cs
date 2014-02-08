using System.Data.Entity;
using System.Threading.Tasks;
using UDG.Colloquium.DL.Custom;

namespace UDG.Colloquium.DL.Repositories
{
    public interface IUnitOfWork<T> where T:DbContext
    {
        void Dispose(bool disposing);
        Task<int> SaveAsync();
        GenericRepository<ApplicationUser> ApplicationUserRepository { get; set; }
    }
}