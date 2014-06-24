using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin;
using Microsoft.Owin.Security;
using UDG.Colloquium.BL.Entities.Account;
using UDG.Colloquium.BL.Managers.Identity;
using UDG.Colloquium.BL.ViewModels.Account.Register;
using UDG.Colloquium.DL.Custom.Users;

namespace UDG.Colloquium.BL.Contracts.Identity
{
    public interface ISecurityUserManager
    {
        void InitializeSettings();
        Task<IEnumerable<ApplicationUser>> GetAllUsersAsync();
        Task<IEnumerable<UserNamesDao>> GetAllUserNamesAsync();
        Task<IEnumerable<UserNamesDao>> GetAllUserNamesAsync(int pageIndex, int pageSize);
        Task<IEnumerable<UserNamesDao>> FindUserNameAsync(string userName);
        Task<IEnumerable<UserNamesDao>> FindUserNameAsync(string userName, int pageIndex, int pageSize);
        Task<IdentityResult> CreateUserAsync(RegisterVm model);
        Task<bool> TryLogin(LoginVm model,IAuthenticationManager authManager);
        void SignInCreatedUser(string userName, IAuthenticationManager authManager);
        bool HasPassword(int userId);
        Task<IdentityResult> ChangePassword(int userId, string oldPassword, string newPassword);
        Task<IdentityResult> AddPassword(int userId,string newPassword);
        Task<bool> IsInRole(int userId, string roleName);
        Task<IdentityResult> AddToRole(int userId, string roleName);
        Task<IdentityResult> RemoveFromRole(int userId, string roleName);
        void Clean();
        Task SignInAsync(IAuthenticationManager authManager, ApplicationUser user, bool isPersistent);
        Task<IList<string>> GetRolesAssignedToUserAsync(int id);
    }
}