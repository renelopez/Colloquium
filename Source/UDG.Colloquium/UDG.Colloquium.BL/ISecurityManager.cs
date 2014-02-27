using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using UDG.Colloquium.BL.ViewModels;
using UDG.Colloquium.DL.Custom;

namespace UDG.Colloquium.BL
{
    public interface ISecurityManager<TU,TR> where TU:IUser where TR:IRole
    {
        UserManager<TU> UserManager { get; set; }
        RoleManager<TR> RoleManager { get; set; }
        Task<IdentityResult> CreateRoleAsync(string roleName);
        Task<IEnumerable<TU>> GetAllUsersAsync();
        Task<IEnumerable<UserNamesViewModel>> GetAllUserNamesAsync();
        Task<IEnumerable<UserNamesViewModel>> GetAllUserNamesAsync(int pageIndex, int pageSize);
        Task<IEnumerable<UserNamesViewModel>> FindUserNameAsync(string userName);
        Task<IEnumerable<UserNamesViewModel>> FindUserNameAsync(string userName, int pageIndex, int pageSize);
        Task<IdentityResult> CreateUserAsync(RegisterViewModel model);
        Task<UserRolesViewModel> GetUserRolesAsync(string id, string userName);
        Task<IEnumerable<RoleNamesViewModel>> GetRolesAsync();
        Task<List<IdentityResult>> RemoveUsersFromRoleAsync(string roleName);
        Task<int> RemoveRoleAsync(string roleId, string roleName);
    }
}