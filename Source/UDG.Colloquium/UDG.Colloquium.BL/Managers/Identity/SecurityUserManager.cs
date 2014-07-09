using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using Autofac.Core;
using AutoMapper;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin;
using Microsoft.Owin.Security;
using Newtonsoft.Json;
using RestSharp;
using UDG.Colloquium.BL.Contracts.Identity;
using UDG.Colloquium.BL.Entities.Account;
using UDG.Colloquium.BL.ViewModels.Account.DTO;
using UDG.Colloquium.BL.ViewModels.Account.Register;
using UDG.Colloquium.DL.Custom.Users;
using UDG.Colloquium.DL.Repositories;

namespace UDG.Colloquium.BL.Managers.Identity
{
    public class SecurityUserManager:UserManager<ApplicationUser,int>, ISecurityUserManager
    {
        public IUnitOfWork UnitOfWork { get; set; }
        public IUserStore<ApplicationUser,int> UserStore { get; set; }

        //public IOwinContext OwinContext { get; set; }

        public SecurityUserManager(IUserStore<ApplicationUser, int> userStore,IUnitOfWork unitOfWork)//, IOwinContext owinContext)
            : base(userStore)
        {
            UnitOfWork = unitOfWork;
            UserStore = userStore;
            //IdentityOptions = identityFactoryOptions;
            //OwinContext = owinContext;
            InitializeSettings();
        }

        public void InitializeSettings()
        {
            UserValidator = new UserValidator<ApplicationUser, int>(this)
            {
                AllowOnlyAlphanumericUserNames = false,
                RequireUniqueEmail = false
            };
            PasswordValidator = new PasswordValidator()
            {
                RequiredLength = 6,
                RequireNonLetterOrDigit = false
            };
            ////var dataProtectionProvider = IdentityOptions.DataProtectionProvider;
            //if (dataProtectionProvider != null)
            //{
            //    UserTokenProvider =
            //        new DataProtectorTokenProvider<ApplicationUser,int>(dataProtectionProvider.Create("ASP.NET Identity"));
            //}

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

        public async Task<IdentityResult> CreateUserAsync(User model)
        {
            var user = new ApplicationUser { UserName = model.UserName };
            return await CreateAsync(user, model.Password);
        }

        public async Task<bool> TryLogin(LoginVm model,IAuthenticationManager authManager)
        {
            var user = await FindAsync(model.UserName, model.Password);
            if (user != null)
            {
                await SignInAsync(authManager,user, model.RememberMe);
                return true;
            }
            return false;
        }

        public async void SignInCreatedUser(string userName, IAuthenticationManager authManager)
        {
            var createdUser = await FindByNameAsync(userName);
            await SignInAsync(authManager,createdUser, isPersistent: false);
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

        public async Task SignInAsync(IAuthenticationManager authManager, ApplicationUser user, bool isPersistent)
        {
            authManager.SignOut(DefaultAuthenticationTypes.ExternalCookie);
            var identity = await CreateIdentityAsync(user, DefaultAuthenticationTypes.ApplicationCookie);
            authManager.SignIn(new AuthenticationProperties() { IsPersistent = isPersistent }, identity);
        }

        public async Task<IList<string>> GetRolesAssignedToUserAsync(int id)
        {
            var userRoles = await GetRolesAsync(id);
            return userRoles;
        }

        public async Task<ApplicationUser> FindUserAsync(string user, string password)
        {
            return await FindAsync(user, password);
        }

        public Task<IRestResponse<AccessData>> RemoteLogin(string userName, string password)
        {
            var tcs = new TaskCompletionSource<IRestResponse<AccessData>>();
            var client = new RestClient("http://localhost:9000");
            var request = new RestRequest("token", Method.POST);

            var data = "grant_type=password&username=" +userName + "&password=" + password;
            request.AddParameter("application/x-www-form-urlencoded", data, ParameterType.RequestBody);
            request.AddHeader("Accept", "application/json");
            request.RequestFormat = DataFormat.Json;

            AccessData accessData = null;
            client.ExecuteAsync<AccessData>(request, response =>
            {
                if (response.ResponseStatus == ResponseStatus.Completed)
                {
                   tcs.SetResult(response);
                }
            });
            return tcs.Task;
        }
    }
}