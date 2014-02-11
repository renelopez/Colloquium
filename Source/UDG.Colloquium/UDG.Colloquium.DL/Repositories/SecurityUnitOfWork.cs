using System;
using System.Data.Entity;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity.EntityFramework;
using UDG.Colloquium.DL.Custom;

namespace UDG.Colloquium.DL.Repositories
{
    public class SecurityUnitOfWork: ISecurityUnitOfWork<IdentityDbContext,ApplicationUser,ApplicationRole>, IDisposable
    {
        private readonly IdentityDbContext _context;
        private bool _disposed;
        private GenericRepository<ApplicationUser> _applicationUserRepository;
        private GenericRepository<ApplicationRole> _applicationRoleRepository;

        public SecurityUnitOfWork(IdentityDbContext context)
        {
            _context = context;
        }

        public GenericRepository<ApplicationUser> ApplicationUserRepository
        {
            get {
                return _applicationUserRepository ??
                       (_applicationUserRepository = new GenericRepository<ApplicationUser>(_context));
            }
            set { _applicationUserRepository=value; }
        }

        public GenericRepository<ApplicationRole> ApplicationRoleRepository
        {
            get
            {
                return _applicationRoleRepository ??
                       (_applicationRoleRepository = new GenericRepository<ApplicationRole>(_context));
            }
            set { _applicationRoleRepository = value; }
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        public void Dispose(bool disposing)
        {
            if (!_disposed && disposing)
            {
                _context.Dispose();
            }
            _disposed = true;
        }

        public async Task<int> SaveAsync()
        {
           return await _context.SaveChangesAsync();
        }
    }
}
