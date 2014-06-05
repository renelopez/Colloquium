using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using UDG.Colloquium.BL.Entities.Account;

namespace UDG.Colloquium.BL.Contracts.Identity
{
    public interface ISecurityRoleManager
    {
        Task<IEnumerable<RoleNamesDao>> GetAllRolesAsync();
        Task<IdentityResult> RemoveRoleAsync(string roleName);
        Task<IdentityResult> CreateRoleAsync(string roleName);
        void Clean();
    }
}