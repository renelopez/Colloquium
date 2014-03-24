using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin;
using UDG.Colloquium.BL.Entities.Identity;
using UDG.Colloquium.DL;
using UDG.Colloquium.DL.Custom.Users;

namespace UDG.Colloquium.BL.Managers
{
    public class SecurityUserManager:UserManager<ApplicationUser,int>
    {
        public SecurityUserManager(IUserStore<ApplicationUser, int> store) : base(store)
        {
        }

        public async Task<IEnumerable<ApplicationUser>> GetAllUsersAsync()
        {
            var users = await Users.ToListAsync();
            return users;
        }

        public async Task<IEnumerable<UserNamesDao>> GetAllUserNamesAsync()
        {
            Mapper.CreateMap<ApplicationUser, UserNamesDao>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.UserName));
            var users = await GetAllUsersAsync();
            var userNames = Mapper.Map<IEnumerable<ApplicationUser>, IEnumerable<UserNamesDao>>(users);
            return userNames;
        }
        public async Task<IEnumerable<UserNamesDao>> GetAllUserNamesAsync(int pageIndex, int pageSize)
        {
            Mapper.CreateMap<ApplicationUser, UserNamesDao>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.UserName));
            var users = await GetAllUsersAsync();
            users = users.Skip(pageIndex).Take(pageSize);
            var userNames = Mapper.Map<IEnumerable<ApplicationUser>, IEnumerable<UserNamesDao>>(users);
            return userNames;
        }

        public async Task<IEnumerable<UserNamesDao>> FindUserNameAsync(string userName)
        {
            Mapper.CreateMap<ApplicationUser, UserNamesDao>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.UserName));
            var users = await Users.Where(usr => usr.UserName.Contains(userName)).ToListAsync();
            var userNames = Mapper.Map<IEnumerable<ApplicationUser>, IEnumerable<UserNamesDao>>(users);
            return userNames;
        }

        public async Task<IEnumerable<UserNamesDao>> FindUserNameAsync(string userName, int pageIndex, int pageSize)
        {
            Mapper.CreateMap<ApplicationUser, UserNamesDao>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.UserName));
            var users = await Users.Where(usr => usr.UserName.Contains(userName)).Take(pageIndex).Skip(pageSize).ToListAsync();;
            var userNames = Mapper.Map<IEnumerable<ApplicationUser>, IEnumerable<UserNamesDao>>(users);
            return userNames;
        }

        public async Task<IdentityResult> CreateUserAsync(RegisterDao model)
        {
            var user = new ApplicationUser { UserName = model.UserName };
            return await CreateAsync(user, model.Password);
        }

        public static SecurityUserManager Create(IdentityFactoryOptions<SecurityUserManager> options, IOwinContext context)
        {
            var manager = new SecurityUserManager(new ApplicationUserStore(context.Get<ColloquiumDbContext>()));
            manager.UserValidator = new UserValidator<ApplicationUser, int>(manager)
            {
                AllowOnlyAlphanumericUserNames = false,
                RequireUniqueEmail = true
            };
            manager.PasswordValidator = new PasswordValidator()
            {
                RequiredLength = 6,
                RequireNonLetterOrDigit = true
            };
            var dataProtectionProvider = options.DataProtectionProvider;
            if (dataProtectionProvider != null)
            {
                manager.UserTokenProvider = new DataProtectorTokenProvider<ApplicationUser, int>(dataProtectionProvider.Create("PasswordReset"));
            }
            return manager;
        }
    }
}