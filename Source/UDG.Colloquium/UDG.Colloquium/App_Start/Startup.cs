using Microsoft.Owin;
using Owin;
using UDG.Colloquium.App_Start;

[assembly: OwinStartup(typeof(Startup))]
namespace UDG.Colloquium.App_Start
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
