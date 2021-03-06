﻿using System;
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
            Sessions=new HashSet<Session>();
        }

        [Key]
        public int Id { get; set; }

        [Required]
        public string Period { get; set; }

        [Required]
        public DateTime BeginDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        [Required]
        public bool IsActive { get; set; }

        public virtual ICollection<Session> Sessions { get; set; }


    }
}
