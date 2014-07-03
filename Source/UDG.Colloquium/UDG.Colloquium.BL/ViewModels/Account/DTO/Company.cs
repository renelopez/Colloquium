using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UDG.Colloquium.BL.ViewModels.Account.DTO
{
    public class Company
    {
        public Company()
        {
            Works = new HashSet<Work>();
        }

        [Key]
        public int CompanyId { get; set; }

        [Required]
        [MaxLength(30)]
        public  string CompanyCorporateName { get; set; }

        [Required]
        [MaxLength(100)]
        [MinLength(10)]
        public  string CompanyDescription { get; set; }

        [Required]
        [MaxLength(30)]
        public  string CompanyAddress { get; set; }

        [Required]
        [DataType(DataType.PhoneNumber)]
        [RegularExpression(@"^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$", ErrorMessage = "Entered phone format is not valid.")]
        public  string CompanyPhoneNumber { get; set; }

        public  ICollection<Work> Works { get; set; }
    }
}
