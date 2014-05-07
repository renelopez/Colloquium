using System.ComponentModel.DataAnnotations;

namespace UDG.Colloquium.ViewModels.Account.Management
{
    public class SelectedRolesDao
    {
        public bool Selected { get; set; }

        [Required]
        public string RoleName { get; set; }
    }
}