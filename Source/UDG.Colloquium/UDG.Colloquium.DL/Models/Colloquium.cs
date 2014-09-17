using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UDG.Colloquium.DL.Custom.Users;

namespace UDG.Colloquium.DL.Models
{
    public class Colloquium
    {
        public Colloquium()
        {
            Users=new HashSet<ApplicationUser>();
        }

        [Key]
        public int ColloquiumId { get; set; }

        [Required]
        public string Period { get; set; }

        [Required]
        public DateTime BeginDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        public virtual ICollection<ApplicationUser> Users { get; set; }
    }
}
