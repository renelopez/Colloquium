using System;
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
using UDG.Colloquium.SL.Providers;
using UDG.Colloquium.SL.ServiceRepositories;

namespace UDG.Colloquium.SL
{
    public class Startup
    {
        // This code configures Web API. The Startup class is specified as a type
        // parameter in the WebApp.Start method.

        public ISecurityUserManager SecurityUserManager { get; set; }
        
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

            var jsonFormatter = config.Formatters.OfType<JsonMediaTypeFormatter>().First();
            jsonFormatter.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();

            // Creating the builder.
            var builder = new ContainerBuilder();


            // Registering controllers
            builder.RegisterApiControllers(Assembly.GetExecutingAssembly());

           // builder.Register(c => HttpContext.Current.GetOwinContext()).As<IOwinContext>();
            // Registering repositories
            builder.RegisterType<ColloquiumRepository>().As<IColloquiumRepository>().InstancePerLifetimeScope();
            builder.RegisterType<ColloquiumDbContext>().As<DbContext>().InstancePerLifetimeScope();

            builder.RegisterType<ApplicationUserStore>()
                .As<IUserStore<ApplicationUser, int>>();

            builder.RegisterType<ColloquiumUnitOfWork>().As<IUnitOfWork>();

            builder.RegisterType<SecurityUserManager>().As<ISecurityUserManager>();

            var container = builder.Build();
            SecurityUserManager = container.Resolve<ISecurityUserManager>();
            ConfigureOAuth(appBuilder);
            config.DependencyResolver = new AutofacWebApiDependencyResolver(container);
            appBuilder.UseWebApi(config);
        }

        public void ConfigureOAuth(IAppBuilder app)
        {
            var OAuthServerOptions = new OAuthAuthorizationServerOptions()
            {
                AllowInsecureHttp = true,
                TokenEndpointPath = new PathString("/token"),
                AccessTokenExpireTimeSpan = TimeSpan.FromDays(1),
                Provider = new SimpleAuthorizationServerProvider(SecurityUserManager)
            };

            // Token Generation
            app.UseOAuthAuthorizationServer(OAuthServerOptions);
            app.UseOAuthBearerAuthentication(new OAuthBearerAuthenticationOptions());
        }
    }
}
