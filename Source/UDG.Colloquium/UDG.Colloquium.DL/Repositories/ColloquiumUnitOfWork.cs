using System;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity.EntityFramework;

namespace UDG.Colloquium.DL.Repositories
{
    public class ColloquiumUnitOfWork<TU, TR> :IDisposable, IUnitOfWork<TU,TR> where TU : class where TR : class 
    {
        private readonly IdentityDbContext _context;
        private bool _disposed;
        private IRepository<TU> _applicationUserRepository;
        private IRepository<TR> _applicationRoleRepository;

        public ColloquiumUnitOfWork(IdentityDbContext context)
        {
            _context = context;
        }

        public IRepository<TU> ApplicationUserRepository
        {
            get {
                return _applicationUserRepository ??
                       (_applicationUserRepository = new GenericRepository<TU>(_context));
            }
            set { _applicationUserRepository=value; }
        }

        public IRepository<TR> ApplicationRoleRepository
        {
            get
            {
                return _applicationRoleRepository ??
                       (_applicationRoleRepository = new GenericRepository<TR>(_context));
            }
            set { _applicationRoleRepository = value; }
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        public virtual void Dispose(bool disposing)
        {
            if (!_disposed && disposing)
            {
                _context.Dispose();
            }
            _disposed = true;
        }

        public async Task<int> SaveChangesAsync()
        {
           return await _context.SaveChangesAsync();
        }
    }
}
