using System;
using System.ComponentModel.DataAnnotations;
using UDG.Colloquium.BL.ViewModels.Account.Register;

namespace UDG.Colloquium.BL.Entities.Account
{
    public class WorkDao
    {
        [Display(Name = "WorkPosition")]
        [MaxLength(30)]
        public string WorkPosition { get; set; }

        [MaxLength(100)]
        [Display(Name = "WorkDescription")]
        public string WorkDescription { get; set; }
        
        [DataType(DataType.Currency)]
        [Display(Name = "Salary")]
        public double WorkSalary { get; set; }

        [Display(Name = "Schema")]
        public SchemaTypeVm SalarySchema { get; set; }

        [Display(Name = "Begin Date")]
        [RegularExpression(@"^[0,1]?\d{1}\/(([0-2]?\d{1})|([3][0,1]{1}))\/(([1]{1}[9]{1}[9]{1}\d{1})|([2-9]{1}\d{3}))$")]
        public DateTime WorkBeginDate { get; set; }

        [Display(Name = "End Date")]
        [RegularExpression(@"^[0,1]?\d{1}\/(([0-2]?\d{1})|([3][0,1]{1}))\/(([1]{1}[9]{1}[9]{1}\d{1})|([2-9]{1}\d{3}))$")]
        public DateTime WorkEndDate { get; set; }

        public CompanyVm Company { get; set; }
    }
}