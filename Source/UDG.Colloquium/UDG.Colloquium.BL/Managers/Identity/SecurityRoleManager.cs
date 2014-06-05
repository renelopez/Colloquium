using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using UDG.Colloquium.BL.Contracts.Identity;
using UDG.Colloquium.BL.Entities.Account;
using UDG.Colloquium.DL.Custom.Roles;
using UDG.Colloquium.DL.Custom.Users;
using UDG.Colloquium.DL.Repositories;

namespace UDG.Colloquium.BL.Managers.Identity
{
    public class SecurityRoleManager:RoleManager<ApplicationRole,int>, ISecurityRoleManager
    {
        public IUnitOfWork UnitOfWork { get; set; }
        public IRoleStore<ApplicationRole, int> RoleStore { get; set; }
        public SecurityRoleManager(IRoleStore<ApplicationRole, int> roleStore, IUnitOfWork unitOfWork)
            : base(roleStore)
        {
            RoleStore = roleStore;
            UnitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<RoleNamesDao>> GetAllRolesAsync()
        {
            var roles = await Roles.ToListAsync();
            var rolesList = Mapper.Map<IEnumerable<ApplicationRole>, IEnumerable<RoleNamesDao>>(roles);
            return rolesList;
        }

        public async Task<IdentityResult> RemoveRoleAsync(string roleName)
        {
            if (!await RoleExistsAsync(roleName)) return new IdentityResult("The role doesnt exists.");
            var res=await DeleteAsync(await FindByNameAsync(roleName));
            return res;
        }

        public async Task<IdentityResult> CreateRoleAsync(string roleName)
        {
            IdentityResult roleResult;
            if (!await RoleExistsAsync(roleName))
            {
                roleResult = await CreateAsync(new ApplicationRole(roleName));
            }
            else
            {
                roleResult = new IdentityResult("Following role already exists:" + roleName);
            }
            return roleResult;
        }

        public void Clean()
        {
            Dispose();
        }

    }
}
