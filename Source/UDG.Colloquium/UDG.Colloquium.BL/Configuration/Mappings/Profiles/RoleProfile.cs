using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using UDG.Colloquium.BL.Entities.Account;
using UDG.Colloquium.DL.Custom.Roles;

namespace UDG.Colloquium.BL.Configuration.Mappings.Profiles
{
    public class RoleProfile:Profile
    {
        protected override void Configure()
        {
            Mapper.CreateMap<ApplicationRole, RoleNamesDao>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.RoleName, opt => opt.MapFrom(src => src.Name));
        }
    }
}
