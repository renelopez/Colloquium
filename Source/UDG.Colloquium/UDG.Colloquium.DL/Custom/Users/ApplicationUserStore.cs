﻿using Microsoft.AspNet.Identity.EntityFramework;
using UDG.Colloquium.DL.Custom.Roles;

namespace UDG.Colloquium.DL.Custom.Users
{
    public class ApplicationUserStore : UserStore<ApplicationUser, ApplicationRole, int, ApplicationUserLogin,ApplicationUserRole,ApplicationUserClaim>
    {
        public ApplicationUserStore(ColloquiumDbContext context)
            : base(context)
        {
        }
    }
}