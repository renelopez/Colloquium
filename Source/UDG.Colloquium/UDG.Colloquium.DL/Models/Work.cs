using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using UDG.Colloquium.DL.Custom.Users;

namespace UDG.Colloquium.DL.Models
{
    public class Work
    {
        [Key]
        public int WorkId { get; set; }

        [Required]
        [MaxLength(20)]
        public string WorkPosition { get; set; }

        [Required]
        [MaxLength(100)]
        [MinLength(10)]
        public string WorkDescription { get; set; }

        [Required]
        [DataType(DataType.Currency)]
        public double Salary { get; set; }

        [Required]
        [MaxLength(20)]
        public string  SalarySchema { get; set; }
        
        [DataType(DataType.Date)]
        public DateTime? BeginDate { get; set; }

        [DataType(DataType.Date)]
        public DateTime? EndDate { get; set; }

        [ForeignKey("ApplicationUser")]
        public int ApplicationUserId { get; set; }

        [ForeignKey("Company")]
        public int CompanyId { get; set; }
        public virtual ApplicationUser ApplicationUser { get; set; }

        public virtual Company Company { get; set; }

        

    }
}
