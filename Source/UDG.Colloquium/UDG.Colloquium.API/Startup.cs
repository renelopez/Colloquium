using System;
using System.Data.Entity;
using System.Linq;
using System.Net.Http.Formatting;
using System.Reflection;
using System.Web.Http;
using System.Web.Http.Cors;
using Autofac;
using Autofac.Integration.WebApi;
using Microsoft.AspNet.Identity;
using Microsoft.Owin;
using Microsoft.Owin.Security.OAuth;
using Newtonsoft.Json.Serialization;
using Owin;
using UDG.Colloquium.API;
using UDG.Colloquium.API.Providers;
using UDG.Colloquium.API.ServiceRepositories;
using UDG.Colloquium.BL.Contracts.Identity;
using UDG.Colloquium.BL.Managers.Identity;
using UDG.Colloquium.DL;
using UDG.Colloquium.DL.Custom.Users;
using UDG.Colloquium.DL.Repositories;

[assembly:OwinStartup(typeof(Startup))]
namespace UDG.Colloquium.API
{
    public class Startup
    {
        public ISecurityUserManager SecurityUserManager { get; set; }
        public void Configuration(IAppBuilder app)
        {
            var config=new HttpConfiguration();
            config.Routes.MapHttpRoute(
               name: "BreezeApi",
               routeTemplate: "api/{controller}/{action}"
           );
            var cors = new EnableCorsAttribute("http://colloquiumweb.azurewebsites.net", "*", "*");
            config.EnableCors(cors);
            var jsonFormatter = config.Formatters.OfType<JsonMediaTypeFormatter>().First();
            jsonFormatter.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();

            // Creating the builder.

            var builder = new ContainerBuilder();


            // Registering Controllers
            builder.RegisterApiControllers(Assembly.GetExecutingAssembly());

            // Registering repositories
            builder.RegisterType<ColloquiumRepository>().As<IColloquiumRepository>().InstancePerLifetimeScope();
            builder.RegisterType<ColloquiumDbContext>().As<DbContext>().InstancePerLifetimeScope();

            builder.RegisterType<ApplicationUserStore>()
                .As<IUserStore<ApplicationUser, int>>();

            builder.RegisterType<ColloquiumUnitOfWork>().As<IUnitOfWork>();

            builder.RegisterType<SecurityUserManager>().As<ISecurityUserManager>();

            var container = builder.Build();
            SecurityUserManager = container.Resolve<ISecurityUserManager>();

            // Configuring OAuth
            ConfigureOAuth(app);
            config.DependencyResolver = new AutofacWebApiDependencyResolver(container);
            app.UseWebApi(config);
        }

        private void ConfigureOAuth(IAppBuilder app)
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