using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using System.Linq.Expressions;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using UDG.Colloquium.BL.ViewModels;
using UDG.Colloquium.DL;
using UDG.Colloquium.DL.Custom;
using UDG.Colloquium.DL.Repositories;

namespace UDG.Colloquium.BL
{
    public class SecurityManager
    {
        public UserManager<ApplicationUser> UserManager { get; set; }
        public RoleManager<ApplicationRole> RoleManager { get; set; }

        public BaseUnitOfWork UnitOfWork { get; set; }
        public SecurityManager(UserManager<ApplicationUser> userManager,RoleManager<ApplicationRole> roleManager,BaseUnitOfWork unitOfWork)
        {
            UserManager = userManager;
            RoleManager = roleManager;
            UnitOfWork = unitOfWork;
        }

        public async Task<IdentityResult> CreateRoleAsync(string roleName)
        {
            IdentityResult roleResult;
            if (!await RoleManager.RoleExistsAsync(roleName))
            {
                roleResult = await RoleManager.CreateAsync(new ApplicationRole(roleName));
            }
            else
            {
                roleResult=new IdentityResult("Following role already exists:"+roleName);
            }
            return roleResult;
        }

        public async Task<IEnumerable<ApplicationUser>> GetUsersAsync()
        {
            var users= await UnitOfWork.ApplicationUserRepository.GetAsync();
            return users;
        }
    }
}
