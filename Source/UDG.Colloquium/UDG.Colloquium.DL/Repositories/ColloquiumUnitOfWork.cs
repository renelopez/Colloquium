using System;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity.EntityFramework;

namespace UDG.Colloquium.DL.Repositories
{
    public class ColloquiumUnitOfWork:IDisposable, IUnitOfWork
    {
        private readonly IdentityDbContext _context;
        private bool _disposed;

        public ColloquiumUnitOfWork(IdentityDbContext context)
        {
            _context = context;
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
