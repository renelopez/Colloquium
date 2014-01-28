using System.Web.Mvc;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Practices.Unity;
using Unity.Mvc5;

namespace UDG.Colloquium.BL
{
    public static class UnityConfig
    {
        public static void RegisterComponents()
        {
			var container = new UnityContainer();
            
            // register all your components with the container here
            // it is NOT necessary to register your controllers
            
            // e.g. container.RegisterType<ITestService, TestService>();
           // 
            container.RegisterType<UserManager<ApplicationUser>>(new InjectionConstructor(typeof (IUserStore<ApplicationUser>)));
            container.RegisterType<IUserStore<ApplicationUser>, UserStore<ApplicationUser>>(new InjectionConstructor(typeof(SecurityDbContext)));
            DependencyResolver.SetResolver(new UnityDependencyResolver(container));
        }
    }
}