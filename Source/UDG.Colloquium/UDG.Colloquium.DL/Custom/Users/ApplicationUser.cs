using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;

namespace UDG.Colloquium.DL.Custom.Users
{
    public class ApplicationUser : IdentityUser<int,ApplicationUserLogin,ApplicationUserRole,ApplicationUserClaim>
    {
        public enum UserGenre
        {
            Male,
            Female
        }
        
        [Required]
        [MaxLength(5)]
        public virtual string LastName { get; set; }
        public virtual string MiddleName { get; set; }

        [Required]
        [MaxLength(10)]
        public virtual string FirstName { get; set; }

        [Required]
        public virtual DateTime? BirthDate { get; set; }
        public virtual string BirthPlace { get; set; }
        public virtual UserGenre Genre { get; set; }
        public virtual string Nacionality { get; set; }


        public virtual ICollection<Work> Works { get; set; }

        public ApplicationUser()
        {
            Works=new HashSet<Work>();
        }
    }
}
