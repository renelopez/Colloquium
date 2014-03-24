using System.ComponentModel.DataAnnotations;

namespace UDG.Colloquium.BL.Entities.Identity
{
    public class RoleNamesDao
    {
        public string Id { get; set; }
        [Required]
        [Display(Name = "Role Name")]
        public string RoleName { get; set; }
    }
}
