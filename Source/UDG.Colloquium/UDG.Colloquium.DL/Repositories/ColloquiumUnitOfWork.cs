using System;
using System.Data.Entity;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity.EntityFramework;

namespace UDG.Colloquium.DL.Repositories
{
    public class ColloquiumUnitOfWork:IDisposable, IUnitOfWork
    {
        private readonly DbContext _context;
        private bool _disposed;

        public ColloquiumUnitOfWork(DbContext context)
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
