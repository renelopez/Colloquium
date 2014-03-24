using System.ComponentModel.DataAnnotations;

namespace UDG.Colloquium.BL.Entities.Identity
{
    public class SelectedRolesDao
    {
        public bool Selected { get; set; }

        [Required]
        public string RoleName { get; set; }
    }
}