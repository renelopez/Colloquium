using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace UDG.Colloquium.BL.ViewModels
{
    public enum Genre
    {
        [Display(Name="Male")]
        Male,
        [Display(Name = "Female")]
        Female
    }

    public enum SchemaType
    {
        [Display(Name = "Base Salary")]
        BaseSalary,
        [Display(Name="Commission")]
        Commission,
        [Display(Name = "Mixed")]
        Mixed
    }
    public class ManageUserViewModel
    {
        [Required]
        [DataType(DataType.Password)]
        [Display(Name = "Current password")]
        public string OldPassword { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "New password")]
        public string NewPassword { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Confirm new password")]
        [Compare("NewPassword", ErrorMessage = "The new password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; }
    }

    public class LoginViewModel
    {
        [Required]
        [Display(Name = "User name")]
        public string UserName { get; set; }

        [Required]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public string Password { get; set; }

        [Display(Name = "Remember me?")]
        public bool RememberMe { get; set; }
    }

    public class RegisterViewModel
    {
        [Required]
        [Display(Name = "User name")]
        public string UserName { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Confirm password")]
        [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; }

        [Display(Name = "First Name")]
        [Required]
        public string FirstName { get; set; }

        [Display(Name = "Middle Name")]
        [Required]
        public string MiddleName { get; set; }

        [Display(Name = "Last Name")]
        [Required]
        public string LastName { get; set; }

        [Display(Name = "Birth Date")]
        [DataType(DataType.Date)]
        [Required]
        public DateTime BirthDate { get; set; }

        [Display(Name = "Birth Place")]
        [Required]
        public string BirthPlace { get; set; }

        [Display(Name = "Sex")]
        [Required]
        public Genre Sex { get; set; }

        [Display(Name = "Nacionality")]
        [Required]
        public string Nacionality { get; set; }

        public ICollection<WorkViewModel> Works { get; set; }
    }

    public class WorkViewModel
    {
        [Display(Name = "WorkPosition")]
        [Required]
        public string WorkPosition { get; set; }

        [Display(Name = "WorkDescription")]
        [Required]
        public string WorkDescription { get; set; }

        [Display(Name = "Salary")]
        [Required]
        public double WorkSalary { get; set; }

        [Display(Name = "Schema")]
        [Required]
        public SchemaType SalarySchema { get; set; }

        [Display(Name = "Begin Date")]
        [DataType(DataType.Date)]
        [Required]
        public DateTime WorkBeginDate { get; set; }

        [Display(Name = "End Date")]
        [DataType(DataType.Date)]
        [Required]
        public DateTime WorkEndDate { get; set; }
    }
}
