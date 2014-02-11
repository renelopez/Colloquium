using System.Data.Entity;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using UDG.Colloquium.DL.Custom;

namespace UDG.Colloquium.DL.Repositories
{
    public interface ISecurityUnitOfWork<TD,TU,TR> where TD:DbContext where TU : class where TR : class
    {
        void Dispose(bool disposing);
        Task<int> SaveAsync();
        GenericRepository<TU> ApplicationUserRepository { get; set; }
        GenericRepository<TR> ApplicationRoleRepository { get; set; }
    }
}