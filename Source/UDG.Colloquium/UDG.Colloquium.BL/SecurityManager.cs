﻿using System;
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

        public ISecurityUnitOfWork<IdentityDbContext,ApplicationUser,ApplicationRole> UnitOfWork { get; set; }
        public SecurityManager(UserManager<ApplicationUser> userManager,RoleManager<ApplicationRole> roleManager,ISecurityUnitOfWork<IdentityDbContext,ApplicationUser,ApplicationRole> unitOfWork)
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

        public async Task<UserRolesViewModel> GetUserRolesAsync(string id)
        {
            var userRoles = await UserManager.GetRolesAsync(id);
            var roles = await UnitOfWork.ApplicationRoleRepository.GetAsync();
            var userViewModel = new UserRolesViewModel
            {
                Id = id,
                UserRoles = userRoles,
                Roles = roles.Select(item => item.Name).ToList()
            };
            return userViewModel;
        }


    }
}
