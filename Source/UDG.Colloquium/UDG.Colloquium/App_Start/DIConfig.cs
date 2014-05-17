using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Autofac;
using Autofac.Integration.Mvc;
using UDG.Colloquium.BL.Configuration.DI;
using UDG.Colloquium.Configuration.DI;

namespace UDG.Colloquium.App_Start
{
    public class DIConfig
    {
        public static void RegisterDependencies()
        {
            // Creating the builder.
            var builder = new ContainerBuilder();


            // Registering controllers
            builder.RegisterControllers(typeof (MvcApplication).Assembly).InstancePerRequest();

           // Registering modules
            builder.RegisterAssemblyModules(typeof (MvcApplication).Assembly);
            builder.RegisterAssemblyModules(typeof (BusinessDIModule).Assembly);
            

            // Building the container
            var container = builder.Build();
            DependencyResolver.SetResolver(new AutofacDependencyResolver(container));


        }
    }
}