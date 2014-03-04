using System.Threading.Tasks;

namespace UDG.Colloquium.DL.Repositories
{
    public interface IUnitOfWork<TU,TR> where TU : class where TR : class 
    {
        void Dispose(bool disposing);
        Task<int> SaveChangesAsync();
        IRepository<TU> ApplicationUserRepository { get; set; }
        IRepository<TR> ApplicationRoleRepository { get; set; }
    }
}