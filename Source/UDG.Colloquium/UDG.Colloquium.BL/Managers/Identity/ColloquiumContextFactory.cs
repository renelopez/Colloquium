using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin;
using UDG.Colloquium.DL;
using UDG.Colloquium.DL.Custom.Users;

namespace UDG.Colloquium.BL.Managers.Identity
{
    public class ColloquiumContextFactory
    {
        public static DbContext Create()
        {
            return new ColloquiumDbContext();
        }
    }
}
