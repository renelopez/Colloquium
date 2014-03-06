using System;
using Microsoft.AspNet.Identity.EntityFramework;

namespace UDG.Colloquium.DL.Custom
{
    public class ApplicationRole:IdentityRole
    {
        public ApplicationRole()
        {
            
        }

        public ApplicationRole(string roleName) : base(roleName)
        {
            
        }
    }
}
