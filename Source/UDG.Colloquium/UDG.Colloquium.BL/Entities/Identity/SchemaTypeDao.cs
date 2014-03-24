using System.ComponentModel.DataAnnotations;

namespace UDG.Colloquium.BL.Entities.Identity
{
    public enum SchemaTypeDao
    {
        [Display(Name = "Base Salary")]
        BaseSalary,
        [Display(Name="Commission")]
        Commission,
        [Display(Name = "Mixed")]
        Mixed
    }
}