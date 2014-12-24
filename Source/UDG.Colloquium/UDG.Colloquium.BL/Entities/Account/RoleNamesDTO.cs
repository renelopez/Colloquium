using System.ComponentModel.DataAnnotations;

namespace UDG.Colloquium.BL.Entities.Account
{
    public class RoleNamesDTO
    {
        public string Id { get; set; }
        [Required]
        [Display(Name = "Role Name")]
        public string RoleName { get; set; }
    }
}
