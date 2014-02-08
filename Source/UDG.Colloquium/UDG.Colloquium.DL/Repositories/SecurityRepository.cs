using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity.EntityFramework;
using UDG.Colloquium.DL.Custom;

namespace UDG.Colloquium.DL.Repositories
{
    public class SecurityRepository:GenericRepository<ApplicationUser>
    {
        public SecurityRepository(IdentityDbContext context)
            : base(context)
        {

        }

    }
}
