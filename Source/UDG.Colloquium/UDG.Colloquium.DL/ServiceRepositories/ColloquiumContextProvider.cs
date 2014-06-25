using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Breeze.ContextProvider;
using Breeze.ContextProvider.EF6;
using Microsoft.AspNet.Identity;
using UDG.Colloquium.DL.Custom.Users;

namespace UDG.Colloquium.DL.ServiceRepositories
{
    public class ColloquiumContextProvider : EFContextProvider<ColloquiumDbContext>
    {
        protected override bool BeforeSaveEntity(EntityInfo entityInfo)
        {
            if (entityInfo.EntityState == EntityState.Added && entityInfo.Entity is ApplicationUser)
            {
                var hasher = new PasswordHasher();
                var cust = (ApplicationUser)entityInfo.Entity;
                cust.PasswordHash = hasher.HashPassword(cust.PasswordHash);
                cust.SecurityStamp = Guid.NewGuid().ToString();

                //entityInfo.OriginalValuesMap["PasswordHash"] = null;
            }
            return base.BeforeSaveEntity(entityInfo);
        }

        protected override Dictionary<Type, List<EntityInfo>> BeforeSaveEntities(Dictionary<Type, List<EntityInfo>> saveMap)
        {
            return base.BeforeSaveEntities(saveMap);
        }
    }
}
