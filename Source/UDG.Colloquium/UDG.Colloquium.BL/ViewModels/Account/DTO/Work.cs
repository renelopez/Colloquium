using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UDG.Colloquium.BL.ViewModels.Account.DTO
{
    public class Work
    {
        [Key]
        public int WorkId { get; set; }

        [Required]
        [MaxLength(20)]
        public  string WorkPosition { get; set; }

        [Required]
        [MaxLength(100)]
        [MinLength(10)]
        public  string WorkDescription { get; set; }

        [Required]
        [DataType(DataType.Currency)]
        public  double Salary { get; set; }

        [Required]
        [MaxLength(20)]
        public  string SalarySchema { get; set; }

        [DataType(DataType.Date)]
        public  DateTime? BeginDate { get; set; }

        [DataType(DataType.Date)]
        public  DateTime? EndDate { get; set; }

        [ForeignKey("User")]
        public int UserId { get; set; }

        [ForeignKey("Company")]
        public int CompanyId { get; set; }
        public  User User { get; set; }

        public  Company Company { get; set; }



    }
}
