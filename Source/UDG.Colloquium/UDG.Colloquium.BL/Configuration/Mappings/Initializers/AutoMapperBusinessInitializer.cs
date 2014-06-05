using AutoMapper;
using UDG.Colloquium.BL.Configuration.Mappings.Initializers;
using UDG.Colloquium.BL.Entities.Account;
using UDG.Colloquium.DL.Custom.Roles;
using UDG.Colloquium.DL.Custom.Users;
using WebActivatorEx;

[assembly :PreApplicationStartMethod(typeof(AutoMapperBusinessInitializer),"Init")]
namespace UDG.Colloquium.BL.Configuration.Mappings.Initializers
{
    public class AutoMapperBusinessInitializer
    {
        public static void Init()
        {
            Mapper.CreateMap<ApplicationRole, RoleNamesDao>()
               .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
               .ForMember(dest => dest.RoleName, opt => opt.MapFrom(src => src.Name));

            Mapper.CreateMap<ApplicationUser, UserNamesDao>()
                 .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                 .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.UserName));
        }
    }
}
