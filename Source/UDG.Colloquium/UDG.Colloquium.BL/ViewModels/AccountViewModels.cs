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
        public ICollection<ContactViewModel> Contacts { get; set; }

    }

    public class WorkViewModel
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
        public SchemaType SalarySchema { get; set; }

        [Display(Name = "Begin Date")]
        [RegularExpression(@"^[0,1]?\d{1}\/(([0-2]?\d{1})|([3][0,1]{1}))\/(([1]{1}[9]{1}[9]{1}\d{1})|([2-9]{1}\d{3}))$")]
        public DateTime WorkBeginDate { get; set; }

        [Display(Name = "End Date")]
        [RegularExpression(@"^[0,1]?\d{1}\/(([0-2]?\d{1})|([3][0,1]{1}))\/(([1]{1}[9]{1}[9]{1}\d{1})|([2-9]{1}\d{3}))$")]
        public DateTime WorkEndDate { get; set; }

        public CompanyViewModel Company { get; set; }
    }

    public class CompanyViewModel
    {
        [Display(Name = "Company Id")]
        public int CompanyId { get; set; }

        [MaxLength(30)]
        [Display(Name = "Company Name")]
        public string CompanyName { get; set; }

        [MaxLength(30)]
        [Display(Name = "Corporate Name")]
        public string CompanyCorporateName { get; set; }

        [DataType(DataType.MultilineText)]
        [Display(Name = "Company Description")]
        public string CompanyDescription { get; set; }

        [MaxLength(50)]
        [Display(Name = "Company Address")]
        public string CompanyAddress { get; set; }

        [MaxLength(30)]
        [DataType(DataType.PhoneNumber)]
        [Display(Name = "Company Phone Number")]
        public string CompanyPhoneNumber { get; set; }

    }

    public class ContactViewModel
    {
        [MaxLength(30)]
        [DataType(DataType.PhoneNumber)]
        [Display(Name="Contact Phone Number")]
        public string ContactPhoneNumber { get; set; }

        [MaxLength(40)]
        [Display(Name = "Contact Address")]
        public string ContactAddress { get; set; }

        [DataType(DataType.EmailAddress)]
        [Display(Name ="Contact Email")]
        public string ContactEmail { get; set; }

        [Display(Name="Contact Type")]
        public string ContactType { get; set; }


    }
}
