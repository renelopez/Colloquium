using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UDG.Colloquium.DL.Custom.Users;

namespace UDG.Colloquium.DL
{
    public class Work
    {
        [Key]
        public int WorkId { get; set; }

        [Required]
        public string WorkPosition { get; set; }

        [Required]
        public string WorkDescription { get; set; }
        [Required]
        public double Salary { get; set; }

        [Required]
        public string  SalarySchema { get; set; }
        public DateTime? BeginDate { get; set; }
        public DateTime? EndDate { get; set; }

        [ForeignKey("ApplicationUser")]
        public int ApplicationUserId { get; set; }

        [ForeignKey("Company")]
        public int CompanyId { get; set; }
        public virtual ApplicationUser ApplicationUser { get; set; }

        public virtual Company Company { get; set; }

        

    }
}
