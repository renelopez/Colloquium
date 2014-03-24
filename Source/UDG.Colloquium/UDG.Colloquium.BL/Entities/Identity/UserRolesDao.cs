using System.Collections.Generic;

namespace UDG.Colloquium.BL.Entities.Identity
{
    public class UserRolesDao
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public List<SelectedRolesDao> UserRoles { get; set; }
    }
}