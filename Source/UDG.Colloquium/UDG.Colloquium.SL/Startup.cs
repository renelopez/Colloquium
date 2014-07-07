using System.Data.Entity;
using System.Linq;
using System.Net.Http.Formatting;
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
using Microsoft.Owin.Security.OAuth;
using Newtonsoft.Json.Serialization;
using Owin;
using Owin;
using UDG.Colloquium.BL.Contracts.Identity;
using UDG.Colloquium.BL.Managers.Identity;
using UDG.Colloquium.DL;
using UDG.Colloquium.DL.Custom.Roles;
using UDG.Colloquium.DL.Custom.Users;
using UDG.Colloquium.DL.Repositories;
using UDG.Colloquium.SL.ServiceRepositories;

namespace UDG.Colloquium.SL
{
    public class Startup
    {
        public static OAuthBearerAuthenticationOptions OAuthBearerOptions { get; private set; }

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

            OAuthBearerOptions = new OAuthBearerAuthenticationOptions();
            appBuilder.UseOAuthBearerAuthentication(OAuthBearerOptions);

            config.SuppressDefaultHostAuthentication();
            config.Filters.Add(new HostAuthenticationFilter("Bearer"));

            var jsonFormatter = config.Formatters.OfType<JsonMediaTypeFormatter>().First();
            jsonFormatter.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();

            // Creating the builder.
            var builder = new ContainerBuilder();


            // Registering controllers
            builder.RegisterApiControllers(Assembly.GetExecutingAssembly());

           // builder.Register(c => HttpContext.Current.GetOwinContext()).As<IOwinContext>();
            // Registering repositories
            builder.RegisterType<RegisterRepository>().As<IRegisterRepository>().InstancePerRequest();
            builder.RegisterType<ColloquiumDbContext>().As<DbContext>().InstancePerRequest();

            builder.RegisterType<ApplicationUserStore>()
                .As<IUserStore<ApplicationUser, int>>();

            builder.RegisterType<ColloquiumUnitOfWork>().As<IUnitOfWork>();

            builder.RegisterType<SecurityUserManager>().As<ISecurityUserManager>();

            var container = builder.Build();
            config.DependencyResolver = new AutofacWebApiDependencyResolver(container);
            appBuilder.UseWebApi(config);
        }
    }
}
