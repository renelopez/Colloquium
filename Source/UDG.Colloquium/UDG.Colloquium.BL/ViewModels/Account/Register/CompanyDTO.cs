using System.ComponentModel.DataAnnotations;

namespace UDG.Colloquium.BL.ViewModels.Account.Register
{
    public class CompanyDTO
    {
        [Display(Name = "Company Id")]
        public int CompanyId { get; set; }

        [MaxLength(30)]
        [Display(Name = "Company Name")]
        public string CompanyName { get; set; }

        [MaxLength(30)]
        [Display(Name = "Corporate Name")]
        public string CompanyCorporateName { get; set; }

        [DataType(DataType.MultilineText)]
        [Display(Name = "Company Description")]
        public string CompanyDescription { get; set; }

        [MaxLength(50)]
        [Display(Name = "Company Address")]
        public string CompanyAddress { get; set; }

        [MaxLength(30)]
        [DataType(DataType.PhoneNumber)]
        [Display(Name = "Company Phone Number")]
        public string CompanyPhoneNumber { get; set; }

    }
}