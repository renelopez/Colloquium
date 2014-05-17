using System;
using Autofac;
using Autofac.Core;
using UDG.Colloquium.Infrastructure;

namespace UDG.Colloquium.Configuration.DI
{
    public class WebDIModule:Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            base.Load(builder);
        }
    }
}