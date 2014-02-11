using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity.EntityFramework;
using UDG.Colloquium.DL.Custom;

namespace UDG.Colloquium.BL.ViewModels
{
    public class UserRolesViewModel
    {
        public string Id { get; set; }
        public ICollection<string> Roles { get; set; }
        public ICollection<string> UserRoles { get; set; }
    }

    public class UserNamesViewModel
    {
        public string Id { get; set; }
        public string UserName { get; set; }
    }
}
