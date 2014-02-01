using System;
using System.Data.Entity;
using System.Threading.Tasks;
using UDG.Colloquium.DL.Custom;

namespace UDG.Colloquium.DL.Repositories
{
    public class UnitOfWork: BaseUnitOfWork,IDisposable
    {
        private readonly DbContext _context;
        private bool _disposed;
        public GenericRepository<ApplicationUser> _applicationUserRepository;
        public UnitOfWork(DbContext context)
        {
            _context = context;
        }

        public override GenericRepository<ApplicationUser> ApplicationUserRepository
        {
            get {
                return _applicationUserRepository ??
                       (_applicationUserRepository = new GenericRepository<ApplicationUser>(_context));
            }
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        public override void Dispose(bool disposing)
        {
            if (!_disposed && disposing)
            {
                _context.Dispose();
            }
            _disposed = true;
        }

        public override async Task<int> SaveAsync()
        {
           return await _context.SaveChangesAsync();
        }
    }
}
