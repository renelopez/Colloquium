using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Breeze.ContextProvider;
using Breeze.ContextProvider.EF6;
using UDG.Colloquium.DL.Custom.Users;

namespace UDG.Colloquium.DL.ServiceRepositories
{
    public class ColloquiumContextProvider : EFContextProvider<ColloquiumDbContext>
    {
        protected override bool BeforeSaveEntity(EntityInfo entityInfo)
        {
            return base.BeforeSaveEntity(entityInfo);
        }

        protected override Dictionary<Type, List<EntityInfo>> BeforeSaveEntities(Dictionary<Type, List<EntityInfo>> saveMap)
        {
            return base.BeforeSaveEntities(saveMap);
        }
    }
}
