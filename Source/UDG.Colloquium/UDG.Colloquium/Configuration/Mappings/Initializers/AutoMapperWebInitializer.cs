using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using AutoMapper;
using UDG.Colloquium.Configuration.Mappings.Initializers;

[assembly: PreApplicationStartMethod(typeof(AutoMapperWebInitializer), "Init")]
namespace UDG.Colloquium.Configuration.Mappings.Initializers
{
    public class AutoMapperWebInitializer
    {
        public static void Init()
        {
            
        }
    }
}