using System.ComponentModel.DataAnnotations;

namespace UDG.Colloquium.BL.ViewModels.Account.Management
{
    public class SelectedRolesVm
    {
        public bool Selected { get; set; }

        [Required]
        public string RoleName { get; set; }
    }
}