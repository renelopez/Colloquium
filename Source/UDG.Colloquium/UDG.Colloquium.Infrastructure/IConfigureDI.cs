using Autofac;

namespace UDG.Colloquium.Infrastructure
{
    public interface IConfigureDI
    {
        void Configure(ContainerBuilder container);
    }
}
