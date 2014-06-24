using System;
using System.Web;
using Autofac;
using Autofac.Core;
using Microsoft.Owin;

namespace UDG.Colloquium.Configuration.DI
{
    public class WebDIModule:Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.Register(c => HttpContext.Current.GetOwinContext()).As<IOwinContext>();
        }
    }
}