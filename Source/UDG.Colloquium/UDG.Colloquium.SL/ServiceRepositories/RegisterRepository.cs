using System;
using System.Collections.Generic;
using System.Linq;
using System.Security;
using System.Security.Principal;
using System.Web;
using Breeze.ContextProvider;
using Breeze.ContextProvider.EF6;
using Microsoft.AspNet.Identity;
using Newtonsoft.Json.Linq;
using UDG.Colloquium.DL;
using UDG.Colloquium.DL.Custom.Users;
using UDG.Colloquium.DL.Models;

namespace UDG.Colloquium.SL.ServiceRepositories
{
    public class RegisterRepository:EFContextProvider<ColloquiumDbContext>,IRegisterRepository
    {
        public string GetMetadata()
        {
            return Metadata();
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

        public SaveResult SaveChanges(JObject saveBundle)
        {
            return base.SaveChanges(saveBundle);
        }

        public IQueryable<Contact> GetContacts()
        {
            return Context.Contacts;
        }

        protected override bool BeforeSaveEntity(EntityInfo entityInfo)
        {
            if (entityInfo.EntityState == EntityState.Added && entityInfo.Entity is ApplicationUser)
            {
                var user = entityInfo.Entity as ApplicationUser;
                user.SecurityStamp = Guid.NewGuid().ToString();
                user.PasswordHash = new PasswordHasher().HashPassword(user.PasswordHash);
            }
            return base.BeforeSaveEntity(entityInfo);
        }

        private bool throwCannotSaveEntityForThisUser()
        {
            throw new SecurityException("Unauthorized user");
        }
    }
}
