using System.ComponentModel.DataAnnotations;

namespace UDG.Colloquium.BL.ViewModels.Account.Register
{
    public enum SchemaTypeVm
    {
        [Display(Name = "Base Salary")]
        BaseSalary,
        [Display(Name="Commission")]
        Commission,
        [Display(Name = "Mixed")]
        Mixed
    }
}