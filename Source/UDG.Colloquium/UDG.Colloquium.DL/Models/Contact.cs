using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UDG.Colloquium.DL.Custom.Users;

namespace UDG.Colloquium.DL.Models
{
    public class Contact
    {
        public enum ContactTypes
        {
            WorkPhone,
            HomePhone,
            Address,
            Email,
            WebPage
        }

        [Key]
        public int ContactId { get; set; }
        public ContactTypes ContactType { get; set; }
        public string ContactInfo { get; set; }

        [ForeignKey("ApplicationUser")]
        public virtual int ApplicationUserId { get; set; }

        public virtual ApplicationUser ApplicationUser { get; set; }
    }
}
