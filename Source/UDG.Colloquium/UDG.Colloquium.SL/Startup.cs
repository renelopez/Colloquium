using System.Reflection;
using System.Security.Principal;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;
using Autofac;
using Autofac.Integration.WebApi;
using Microsoft.AspNet.Identity;
using Microsoft.Owin;
using Microsoft.Owin;
using Microsoft.Owin.Security.Cookies;
using Owin;
using Owin;
using UDG.Colloquium.DL;
using UDG.Colloquium.SL.ServiceRepositories;

namespace UDG.Colloquium.SL
{
    public class Startup
    {
        // This code configures Web API. The Startup class is specified as a type
        // parameter in the WebApp.Start method.
        public void Configuration(IAppBuilder appBuilder)
        {
            // Configure Web API for self-host. 
            var config = new HttpConfiguration();
            var cors = new EnableCorsAttribute("*", "*", "*") { SupportsCredentials = true };
            config.EnableCors(cors);
            config.Routes.MapHttpRoute(
                name: "BreezeApi",
                routeTemplate: "api/{controller}/{action}",
                defaults: new { id = RouteParameter.Optional }
            );

            // Creating the builder.
            var builder = new ContainerBuilder();


            // Registering controllers
            builder.RegisterApiControllers(Assembly.GetExecutingAssembly());

            // Registering repositories
            builder.RegisterType<RegisterRepository>().As<IRegisterRepository>().InstancePerLifetimeScope();
            builder.RegisterType<ColloquiumDbContext>().As<ColloquiumDbContext>().InstancePerLifetimeScope();

            var container = builder.Build();
            config.DependencyResolver = new AutofacWebApiDependencyResolver(container);
            appBuilder.UseWebApi(config);
        }
    }
}
