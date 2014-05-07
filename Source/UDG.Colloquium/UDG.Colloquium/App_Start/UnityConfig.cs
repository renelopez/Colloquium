using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure.DependencyResolution;
using System.Linq;
using System.Web.Mvc;
using Microsoft.Practices.Unity;
using UDG.Colloquium.BL.Configuration.DI;
using UDG.Colloquium.Configuration.DI;
using Unity.Mvc5;

namespace UDG.Colloquium
{
    public static class UnityConfig
    {
        public static void RegisterComponents()
        {
			var container = new UnityContainer();
            
            // register all your components with the container here
            // it is NOT necessary to register your controllers
            
            // e.g. container.RegisterType<ITestService, TestService>();
            new WebDIConfiguration().Configure(container);
            new BusinessDIConfiguration().Configure(container);

            DependencyResolver.SetResolver(new UnityDependencyResolver(container));

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