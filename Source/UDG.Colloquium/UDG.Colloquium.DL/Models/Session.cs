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
    public class Session
    {
        [Required]
        public int Id { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public string Name { get; set; }

        public int ColloquiumId { get; set; }

        public Colloquium Colloquium { get; set; }

        public int ApplicationUserId { get; set; }

        public ApplicationUser ApplicationUser { get; set; }

        [Required]
        public bool IsActive { get; set; }
    }
}
