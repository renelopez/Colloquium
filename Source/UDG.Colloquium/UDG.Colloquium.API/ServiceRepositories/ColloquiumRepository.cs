using System;
using System.Linq;
using System.Security;
using Breeze.ContextProvider;
using Breeze.ContextProvider.EF6;
using Microsoft.AspNet.Identity;
using Newtonsoft.Json.Linq;
using UDG.Colloquium.DL;
using UDG.Colloquium.DL.Custom.Roles;
using UDG.Colloquium.DL.Custom.Users;
using UDG.Colloquium.DL.Models;

namespace UDG.Colloquium.API.ServiceRepositories
{
    public class ColloquiumRepository:EFContextProvider<ColloquiumDbContext>,IColloquiumRepository
    {
        public string GetMetadata()
        {
            return Metadata();
        }

        public IQueryable<DL.Models.Colloquium> GetColloquiums()
        {
            return Context.Colloquiums;
        }

        public IQueryable<ApplicationUser> GetUsers()
        {
            return Context.Users;
        }

        public IQueryable<Work> GetWorks()
        {
            return Context.Works;
        }

        public IQueryable<Company> GetCompanies()
        {
            return Context.Companies;
        }

        public IQueryable<ApplicationRole> GetRoles()
        {
            return Context.Roles;
        }

        public SaveResult SaveChanges(JObject saveBundle)
        {
            return base.SaveChanges(saveBundle);
        }

        public IQueryable<Contact> GetContacts()
        {
            return Context.Contacts;
        }

        public IQueryable<Session> GetSessions()
        {
            return Context.Sessions;
        }

        public IQueryable<Comment> GetComments()
        {
            return Context.Comments;
        }

        protected override bool BeforeSaveEntity(EntityInfo entityInfo)
        {
            if (entityInfo.EntityState == EntityState.Added && entityInfo.Entity is ApplicationUser)
            {
                var user = entityInfo.Entity as ApplicationUser;
                user.SecurityStamp = Guid.NewGuid().ToString();
                user.PasswordHash = new PasswordHasher().HashPassword(user.PasswordHash);
            }
            if (entityInfo.EntityState == EntityState.Modified && entityInfo.Entity is ApplicationUser)
            {
                var user = entityInfo.Entity as ApplicationUser;
                if (user.PasswordHash != "")
                {
                    user.PasswordHash = new PasswordHasher().HashPassword(user.PasswordHash);
                }
            }
            return base.BeforeSaveEntity(entityInfo);
        }

        private bool throwCannotSaveEntityForThisUser()
        {
            throw new SecurityException("Unauthorized user");
        }
    }
}
