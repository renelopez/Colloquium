using System;
using System.Data.Entity;
using Autofac;
using Autofac.Core;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using UDG.Colloquium.BL.Contracts.Identity;
using UDG.Colloquium.BL.Managers;
using UDG.Colloquium.BL.Managers.Identity;
using UDG.Colloquium.DL;
using UDG.Colloquium.DL.Custom.Roles;
using UDG.Colloquium.DL.Custom.Users;
using UDG.Colloquium.DL.Repositories;

namespace UDG.Colloquium.BL.Configuration.DI
{
    public class BusinessDIModule:Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterType<ColloquiumDbContext>().As<DbContext>();

            builder.RegisterType<ApplicationUserStore>()
                .As<IUserStore<ApplicationUser, int>>();

            builder.RegisterType<ApplicationRoleStore>()
                .As<IRoleStore<ApplicationRole, int>>();

            builder.RegisterType<ColloquiumUnitOfWork>().As<IUnitOfWork>();

            builder.RegisterType<SecurityUserManager>().As<ISecurityUserManager>();

            builder.RegisterType<SecurityRoleManager>().As<ISecurityRoleManager>();
        }

    }
}
