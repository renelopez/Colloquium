using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;

namespace UDG.Colloquium.BL
{
    public class SecurityManager<T>:UserManager<T> where T : IdentityUser
    {
        public SecurityManager(IUserStore<T> store) : base(store)
        {

        }
    }
}
