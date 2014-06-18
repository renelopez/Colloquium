using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UDG.Colloquium.DL
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
        public string CompanyCorporateName { get; set; }

        [Required]
        public string CompanyDescription { get; set; }

        [Required]
        public string CompanyAddress { get; set; }
        [Required]
        public string CompanyPhoneNumber { get; set; }

        public virtual ICollection<Work> Works { get; set; }
    }
}
