using System.ComponentModel.DataAnnotations;

namespace UDG.Colloquium.ViewModels.Account.Register
{
    public class ContactVm
    {
        [MaxLength(30)]
        [DataType(DataType.PhoneNumber)]
        [Display(Name="Contact Phone Number")]
        public string ContactPhoneNumber { get; set; }

        [MaxLength(40)]
        [Display(Name = "Contact Address")]
        public string ContactAddress { get; set; }

        [DataType(DataType.EmailAddress)]
        [Display(Name ="Contact Email")]
        public string ContactEmail { get; set; }

        [Display(Name="Contact Type")]
        public string ContactType { get; set; }


    }
}
