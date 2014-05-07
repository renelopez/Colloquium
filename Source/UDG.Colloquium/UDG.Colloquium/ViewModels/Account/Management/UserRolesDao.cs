using System.Collections.Generic;

namespace UDG.Colloquium.ViewModels.Account.Management
{
    public class UserRolesDao
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public List<SelectedRolesDao> UserRoles { get; set; }
    }
}