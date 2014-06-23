using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace UDG.Colloquium.DL.Models
{
    public class Company
    {
        public Company()
        {
            Works=new HashSet<Work>();
        }

        [Key]
        public int CompanyId { get; set; }

        [Required]
        [MaxLength(30)]
        public string CompanyCorporateName { get; set; }

        [Required]
        [MaxLength(100)]
        [MinLength(10)]
        public string CompanyDescription { get; set; }

        [Required]
        [MaxLength(30)]
        public string CompanyAddress { get; set; }

        [Required]
        [DataType(DataType.PhoneNumber)]
        [RegularExpression(@"^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$", ErrorMessage = "Entered phone format is not valid.")]
        public string CompanyPhoneNumber { get; set; }

        public virtual ICollection<Work> Works { get; set; }
    }
}
