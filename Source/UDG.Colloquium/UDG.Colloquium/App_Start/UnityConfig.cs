using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure.DependencyResolution;
using System.Linq;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Practices.Unity;
using UDG.Colloquium.BL;
using UDG.Colloquium.DL;
using UDG.Colloquium.DL.Custom;
using UDG.Colloquium.DL.Custom.Roles;
using UDG.Colloquium.DL.Custom.Users;
using UDG.Colloquium.DL.Repositories;
using Unity.Mvc5;

namespace UDG.Colloquium
{
    public static class UnityConfig
    {
        public static void RegisterComponents()
        {
			//var container = new UnityContainer();
            
            // register all your components with the container here
            // it is NOT necessary to register your controllers
            
            // e.g. container.RegisterType<ITestService, TestService>();
           // DependencyResolver.SetResolver(new UnityDependencyResolver(container));

          //  DbConfiguration.Loaded += (s, e) =>
          //      e.AddDependencyResolver(new UnityDbDependencyResolver(container), overrideConfigFile: false);
        }
    }

    public class UnityDbDependencyResolver : IDbDependencyResolver
    {

        private readonly IUnityContainer _container;

        public UnityDbDependencyResolver(IUnityContainer container)
        {
            _container = container;
        }

        public object GetService(Type type, object key)
        {
            return _container.IsRegistered(type) ? _container.Resolve(type) : null;
        }

        public IEnumerable<object> GetServices(Type type, object key)
        {
            return _container.IsRegistered(type) ? new[] {_container.Resolve(type)} : Enumerable.Empty<object>();
        }
    }
}