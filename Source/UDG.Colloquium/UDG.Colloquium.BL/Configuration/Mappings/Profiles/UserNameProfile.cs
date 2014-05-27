using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using UDG.Colloquium.BL.Entities.Account;
using UDG.Colloquium.DL.Custom.Users;

namespace UDG.Colloquium.BL.Configuration.Mappings.Profiles
{
    public class UserNameProfile:Profile
    {
        protected override void Configure()
        {
            Mapper.CreateMap<ApplicationUser, UserNamesDao>()
                  .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                  .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.UserName));
        }
    }
}
