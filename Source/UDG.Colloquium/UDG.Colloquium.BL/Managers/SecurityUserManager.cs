using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Security.Principal;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin;
using Microsoft.Owin.Security;
using UDG.Colloquium.BL.Entities.Account;
using UDG.Colloquium.BL.Helpers;
using UDG.Colloquium.BL.ViewModels.Account.Register;
using UDG.Colloquium.DL;
using UDG.Colloquium.DL.Custom.Users;
using UDG.Colloquium.DL.Repositories;

namespace UDG.Colloquium.BL.Managers
{
    public class SecurityUserManager:UserManager<ApplicationUser,int>
    {
        public IUnitOfWork UnitOfWork { get; set; }
        public SecurityUserManager(IUserStore<ApplicationUser, int> store,IUnitOfWork unitOfWork) : base(store)
        {
            this.UnitOfWork = unitOfWork;
        }

        private SignInHelper _helper;

        private SignInHelper SignInHelper
        {
            get
            {
                if (_helper == null)
                {
                    _helper = new SignInHelper(this);
                }
                return _helper;
            }
        }


        private SecurityUserManager(IUserStore<ApplicationUser, int> store) : base(store)
        {
                
        }

        public static SecurityUserManager Create(IdentityFactoryOptions<SecurityUserManager> options, IOwinContext context)
        {
            var manager = new SecurityUserManager(new ApplicationUserStore(context.Get<ColloquiumDbContext>()));
            manager.UserValidator = new UserValidator<ApplicationUser, int>(manager)
            {
                AllowOnlyAlphanumericUserNames = false,
                RequireUniqueEmail = false
            };
            manager.PasswordValidator = new PasswordValidator
            {
                RequiredLength = 6,
                RequireNonLetterOrDigit = false
            };
            var dataProtectionProvider = options.DataProtectionProvider;
            if (dataProtectionProvider != null)
            {
                manager.UserTokenProvider = new DataProtectorTokenProvider<ApplicationUser, int>(dataProtectionProvider.Create("PasswordReset"));
            }
            return manager;
        }

        public async Task<IEnumerable<ApplicationUser>> GetAllUsersAsync()
        {
            var users = await Users.ToListAsync();
            return users;
        }

        public async Task<IEnumerable<UserNamesDao>> GetAllUserNamesAsync()
        {
            var users = await GetAllUsersAsync();
            var userNames = Mapper.Map<IEnumerable<ApplicationUser>, IEnumerable<UserNamesDao>>(users);
            return userNames;
        }
        public async Task<IEnumerable<UserNamesDao>> GetAllUserNamesAsync(int pageIndex, int pageSize)
        {
            var users = await GetAllUsersAsync();
            users = users.Skip(pageIndex).Take(pageSize);
            var userNames = Mapper.Map<IEnumerable<ApplicationUser>, IEnumerable<UserNamesDao>>(users);
            return userNames;
        }

        public async Task<IEnumerable<UserNamesDao>> FindUserNameAsync(string userName)
        {
            var users = await Users.Where(usr => usr.UserName.Contains(userName)).ToListAsync();
            var userNames = Mapper.Map<IEnumerable<ApplicationUser>, IEnumerable<UserNamesDao>>(users);
            return userNames;
        }
        public async Task<IEnumerable<UserNamesDao>> FindUserNameAsync(string userName, int pageIndex, int pageSize)
        {
            var users = await Users.Where(usr => usr.UserName.Contains(userName)).Take(pageIndex).Skip(pageSize).ToListAsync();;
            var userNames = Mapper.Map<IEnumerable<ApplicationUser>, IEnumerable<UserNamesDao>>(users);
            return userNames;
        }

        public async Task<IdentityResult> CreateUserAsync(RegisterVm model)
        {
            var user = new ApplicationUser { UserName = model.UserName };
            return await CreateAsync(user, model.Password);
        }

        public async Task<bool> TryLogin(LoginVm model,IAuthenticationManager authManager)
        {
            var user = await FindAsync(model.UserName, model.Password);
            if (user != null)
            {
                await SignInHelper.SignInAsync(authManager,user, model.RememberMe);
                return true;
            }
            return false;
        }

        public async void SignInCreatedUser(string userName, IAuthenticationManager authManager)
        {
            var createdUser = await FindByNameAsync(userName);
            await SignInHelper.SignInAsync(authManager,createdUser, isPersistent: false);
        }

        public bool HasPassword(int userId)
        {
            var user = this.FindById(userId);
            if (user != null)
            {
                return user.PasswordHash != null;
            }
            return false;
        }

        public async Task<IdentityResult> ChangePassword(int userId, string oldPassword, string newPassword)
        {
           return await ChangePasswordAsync(userId, oldPassword, newPassword);
        }
        public async Task<IdentityResult> AddPassword(int userId,string newPassword)
        {
            return await AddPasswordAsync(userId, newPassword);
        }

        public async Task<bool> IsInRole(int userId, string roleName)
        {
            return await IsInRoleAsync(userId, roleName);
        }

        public async Task<IdentityResult> AddToRole(int userId, string roleName)
        {
            return await AddToRoleAsync(userId, roleName);
        }

        public async Task<IdentityResult> RemoveFromRole(int userId, string roleName)
        {
            return await RemoveFromRoleAsync(userId, roleName);
        }

        public void Clean()
        {
            Dispose();
        }
    }
}