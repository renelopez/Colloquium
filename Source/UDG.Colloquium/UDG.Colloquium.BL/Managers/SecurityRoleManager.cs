using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin;
using UDG.Colloquium.BL.Entities.Account;
using UDG.Colloquium.DL;
using UDG.Colloquium.DL.Custom.Roles;
using UDG.Colloquium.DL.Custom.Users;

namespace UDG.Colloquium.BL.Managers
{
    public class SecurityRoleManager:RoleManager<ApplicationRole,int>
    {
        public SecurityRoleManager(IRoleStore<ApplicationRole, int> store) : base(store)
        {

        }

        public static SecurityRoleManager Create(IdentityFactoryOptions<SecurityRoleManager> options, IOwinContext context)
        {
            var manager = new SecurityRoleManager(new ApplicationRoleStore(context.Get<ColloquiumDbContext>()));
            return manager;
        }

        public async Task<IEnumerable<RoleNamesDao>> GetRolesAsync()
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

    }
}
