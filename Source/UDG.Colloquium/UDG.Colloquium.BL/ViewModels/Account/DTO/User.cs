using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UDG.Colloquium.BL.ViewModels.Account.DTO
{
    public class User
    {
        public enum UserGenre
        {
            Male,
            Female
        }

        [Key]
        public int UserId { get; set; }


        [Required]
        public string UserName { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 6)]
        public string Password { get; set; }

        [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; }

        [Required]
        [MaxLength(30)]
        public  string LastName { get; set; }

        [MaxLength(20)]
        public  string MiddleName { get; set; }

        [Required]
        [MaxLength(20)]
        public  string FirstName { get; set; }

        [Required]
        [DataType(DataType.DateTime)]
        public  DateTime? BirthDate { get; set; }
        [Required]
        public  string BirthPlace { get; set; }
        [Required]
        public  UserGenre Genre { get; set; }
        [Required]
        public  string Nacionality { get; set; }


        public  ICollection<Work> Works { get; set; }

        public User()
        {
            Works=new HashSet<Work>();
        }
    }
}
