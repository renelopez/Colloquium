using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using UDG.Colloquium.BL.Entities.Account;

namespace UDG.Colloquium.BL.ViewModels.Account.Register
{
    public class RegisterVm
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
        public GenreDVm Sex { get; set; }

        [Display(Name = "Nacionality")]
        [Required]
        public string Nacionality { get; set; }

        public ICollection<WorkDao> Works { get; set; }
        public ICollection<ContactVm> Contacts { get; set; }

    }
}