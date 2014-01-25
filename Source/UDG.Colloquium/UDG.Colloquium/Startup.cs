using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(UDG.Colloquium.Startup))]
namespace UDG.Colloquium
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
