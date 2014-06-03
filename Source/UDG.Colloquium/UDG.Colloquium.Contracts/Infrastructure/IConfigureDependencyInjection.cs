using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Autofac;

namespace UDG.Colloquium.Contracts.Infrastructure
{
    public interface IConfigureDependencyInjection
    {
        void Configure(ContainerBuilder container);
    }
}
