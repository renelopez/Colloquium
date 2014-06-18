using System;
using System.Collections.Generic;
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


        public string LastName { get; set; }
        public string MiddleName { get; set; }
        public DateTime? BirthDate { get; set; }
        public string BirthPlace { get; set; }
        public UserGenre Genre { get; set; }
        public string Nacionality { get; set; }


        public virtual ICollection<Work> Works { get; set; }

        public ApplicationUser()
        {
            Works=new HashSet<Work>();
        }
    }
}
