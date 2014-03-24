using System.Threading.Tasks;

namespace UDG.Colloquium.DL.Repositories
{
    public interface IUnitOfWork
    {
        void Dispose(bool disposing);
        Task<int> SaveChangesAsync();
    }
}