using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;

namespace UDG.Colloquium.BL.Configuration.Mappings.Initializer
{
    public static class AutoMapperBusinessConfiguration
    {
        public static void Configure()
        {
            Mapper.Initialize(cfg =>
            {

            });
        }
    }
}
