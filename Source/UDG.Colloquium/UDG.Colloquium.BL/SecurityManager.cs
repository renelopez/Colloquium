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
    public class SecurityManager : ISecurityManager<ApplicationUser,ApplicationRole>
    {
        public UserManager<ApplicationUser> UserManager { get; set; }
        public RoleManager<ApplicationRole> RoleManager { get; set; }

        public ISecurityUnitOfWork<ApplicationUser,ApplicationRole> UnitOfWork { get; set; }
        public SecurityManager(UserManager<ApplicationUser> userManager,RoleManager<ApplicationRole> roleManager,ISecurityUnitOfWork<ApplicationUser,ApplicationRole> unitOfWork)
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

        public async Task<IEnumerable<UserNamesViewModel>> GetUserNamesAsync()
        {
            Mapper.CreateMap<ApplicationUser, UserNamesViewModel>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.UserName));
            var users = await GetUsersAsync();
            var userNames = Mapper.Map<IEnumerable<ApplicationUser>, IEnumerable<UserNamesViewModel>>(users);
            return userNames;
        }

        public async Task<IdentityResult> CreateUserAsync(RegisterViewModel model)
        {
            var user = new ApplicationUser {UserName = model.UserName};
            return await UserManager.CreateAsync(user, model.Password);
        }

        public async Task<UserRolesViewModel> GetUserRolesAsync(string id, string userName)
        {
            var userRoles = await UserManager.GetRolesAsync(id);
            var roles = await UnitOfWork.ApplicationRoleRepository.GetAsync();
            var userViewModel = new UserRolesViewModel
            {
                Id = id,
                UserName=userName,
                UserRoles = new List<SelectedRolesViewModel>()
            };
            foreach (var role in roles)
            {
                userViewModel.UserRoles.Add(userRoles.Contains(role.Name)
                    ? new SelectedRolesViewModel() {RoleName = role.Name, Selected = true}
                    : new SelectedRolesViewModel() {RoleName = role.Name});
            }

            return userViewModel;
        }

        public async Task<IEnumerable<RoleNamesViewModel>> GetRolesAsync()
        {
            Mapper.CreateMap<ApplicationRole, RoleNamesViewModel>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.RoleName, opt => opt.MapFrom(src => src.Name));
            var roles = await UnitOfWork.ApplicationRoleRepository.GetAsync();
            var rolesList = Mapper.Map<IEnumerable<ApplicationRole>, IEnumerable<RoleNamesViewModel>>(roles);
            return rolesList;
        }

        public async Task<List<IdentityResult>> RemoveUsersFromRoleAsync(string roleName)
        {
            List<IdentityResult> results = null;
            if (await RoleManager.RoleExistsAsync(roleName))
            {
                var users =await
                    UnitOfWork.ApplicationUserRepository.GetAsync(
                        filter: usr => usr.Roles.Any(role => role.Role.Name == roleName));
                var applicationUsers = users as IList<ApplicationUser> ?? users.ToList();
                if (applicationUsers.Any())
                {
                    foreach (var user in applicationUsers)
                    {
                        results.Add(await UserManager.RemoveFromRoleAsync(user.Id, roleName));
                    }

                }
            }
            
            return results;
        }

        public async Task<int> RemoveRoleAsync(string roleId,string roleName)
        {
            if (!await RoleManager.RoleExistsAsync(roleName)) return -1;
            UnitOfWork.ApplicationRoleRepository.DeleteByIdAsync(roleId);
            return await UnitOfWork.SaveChangesAsync();
        }
    }
}
