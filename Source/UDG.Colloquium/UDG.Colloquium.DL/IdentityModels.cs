﻿using System.Data.Entity;
using Microsoft.AspNet.Identity.EntityFramework;
using UDG.Colloquium.DL.Custom;
using UDG.Colloquium.DL.Custom.Roles;
using UDG.Colloquium.DL.Custom.Users;
using UDG.Colloquium.DL.DBInitializers;
using UDG.Colloquium.DL.Repositories;

namespace UDG.Colloquium.DL
{
    public class ColloquiumDbContext : IdentityDbContext<ApplicationUser,ApplicationRole,int,ApplicationUserLogin,ApplicationUserRole,ApplicationUserClaim>
    {
        public DbSet<Work> Works { get; set; }
        public DbSet<Company> Companies { get; set; }
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<ApplicationUser>().ToTable("Users");
            modelBuilder.Entity<ApplicationUser>().Property(prop => prop.LastName).HasMaxLength(5);
            modelBuilder.Entity<ApplicationRole>().ToTable("Roles");
            modelBuilder.Entity<ApplicationUserLogin>().ToTable("UserLogins");
            modelBuilder.Entity<ApplicationUserClaim>().ToTable("UserClaims");
            modelBuilder.Entity<ApplicationUserRole>().ToTable("UserRoles");
        }

        public ColloquiumDbContext()
            : base("ColloquiumConnection")
        {
            Database.SetInitializer(new ColloquiumDBContextInitializer());
        }
    }
}