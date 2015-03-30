using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Win32;
using UDG.Colloquium.DL.Models;

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
        [MaxLength(30)]
        public virtual string LastName { get; set; }

        [MaxLength(20)]
        public virtual string MiddleName { get; set; }

        [Required]
        [MaxLength(20)]
        public virtual string FirstName { get; set; }

        [Required]
        [DataType(DataType.DateTime)]
        public virtual DateTime? BirthDate { get; set; }
        [Required]
        public virtual string BirthPlace { get; set; }
        [Required]
        public virtual UserGenre Genre { get; set; }
        [Required]
        public virtual string Nacionality { get; set; }
        public int? ColloquiumId { get; set; }

        public virtual ICollection<Models.Colloquium> Colloquiums { get; set; }

        public virtual ICollection<Work> Works { get; set; }
        public virtual ICollection<Contact> Contacts { get; set; }
        public virtual ICollection<Session> Sessions { get; set; }

        public bool IsActive { get; set; }

        public ApplicationUser()
        {
            Works=new HashSet<Work>();
            Colloquiums=new HashSet<Models.Colloquium>();
            Sessions = new HashSet<Session>();
        }
    }
}
