using System.Data.Entity;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Practices.Unity;
using UDG.Colloquium.BL;
using UDG.Colloquium.DL;
using UDG.Colloquium.DL.Custom;
using UDG.Colloquium.DL.Repositories;
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
            // 
            // General Manager
            container.RegisterType<ISecurityManager<ApplicationUser,ApplicationRole>,SecurityManager>(new HierarchicalLifetimeManager(),(new InjectionConstructor((typeof(UserManager<ApplicationUser>)),((typeof(RoleManager<ApplicationRole>))),((typeof(IUnitOfWork<IdentityDbContext>))))));

            // Registering Manager and Store for Users.
            container.RegisterType<UserManager<ApplicationUser>>(new HierarchicalLifetimeManager(),new InjectionConstructor(typeof(IUserStore<ApplicationUser>)));
            container.RegisterType<IUserStore<ApplicationUser>, ApplicationUserStore>(new HierarchicalLifetimeManager());

            // Registering Manager and Store for Roles.
            container.RegisterType<RoleManager<ApplicationRole>>(new HierarchicalLifetimeManager(),new InjectionConstructor(typeof(IRoleStore<ApplicationRole>)));
            container.RegisterType<IRoleStore<ApplicationRole>, ApplicationRoleStore>(new HierarchicalLifetimeManager());
            container.RegisterType<IUnitOfWork<IdentityDbContext>, SecurityUnitOfWork>(new HierarchicalLifetimeManager());

            // Registering Contexts.
            container.RegisterType<IdentityDbContext, SecurityDbContext>();
            DependencyResolver.SetResolver(new UnityDependencyResolver(container));
        }
    }
}