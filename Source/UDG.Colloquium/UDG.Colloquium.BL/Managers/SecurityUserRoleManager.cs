using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UDG.Colloquium.BL.Entities.Account;
using UDG.Colloquium.BL.ViewModels.Account.Management;

namespace UDG.Colloquium.BL.Managers
{
    public class SecurityUserRoleManager
    {
        public SecurityUserManager UserManager;
        public SecurityRoleManager RoleManager;

        public SecurityUserRoleManager(SecurityUserManager userManager,SecurityRoleManager roleManager)
        {
            UserManager = userManager;
            RoleManager = roleManager;
        }

        public async Task<UserRolesDao> GetUserRolesDao(int id, string userName)
        {
            var userRoles = await UserManager.GetRolesAsync(id);
            var allRoles = await RoleManager.Roles.ToListAsync();
            var userViewModel = new UserRolesDao
            {
                Id = id,
                UserName = userName,
                UserRoles = new List<SelectedRolesVm>()
            };
            foreach (var role in allRoles)
            {
                userViewModel.UserRoles.Add(userRoles.Contains(role.Name)
                    ? new SelectedRolesVm() { RoleName = role.Name, Selected = true }
                    : new SelectedRolesVm() { RoleName = role.Name });
            }
            return userViewModel;
        }
    }
}
