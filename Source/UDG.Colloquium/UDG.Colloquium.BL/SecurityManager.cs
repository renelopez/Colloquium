using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using System.Linq.Expressions;
using AutoMapper;
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

        public IUnitOfWork<IdentityDbContext> UnitOfWork { get; set; }
        public SecurityManager(UserManager<ApplicationUser> userManager,RoleManager<ApplicationRole> roleManager,IUnitOfWork<IdentityDbContext> unitOfWork)
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
            var users = await UnitOfWork.ApplicationUserRepository.GetAsync();
            return users;
        }

        public async Task<IEnumerable<UserRolesViewModel>> GetUsersWithRolesAsync()
        {
            Mapper.CreateMap<ApplicationUser, UserRolesViewModel>()
                .ForMember(a=>a.UserName,opt=>opt.MapFrom(src=>src.UserName))
                .ForMember(a => a.Roles, opt => opt.MapFrom(src => src.Roles));
            var users = await GetUsersAsync();
            var usersWithRoles = Mapper.Map<IEnumerable<ApplicationUser>, IEnumerable<UserRolesViewModel>>(users);
            return usersWithRoles;
        }
    }
}
