using System.Collections.Generic;
using UDG.Colloquium.BL.ViewModels.Account.Management;

namespace UDG.Colloquium.BL.Entities.Account
{
    public class UserRolesDao
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public List<SelectedRolesVm> UserRoles { get; set; }
    }
}