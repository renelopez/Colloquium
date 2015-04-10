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
    public class Comment
    {
        [Key]
        public int CommentId { get; set; }

        [DataType(DataType.DateTime)]
        public DateTime DateTime { get; set; }

        [DataType(DataType.Text)]
        public string Text { get; set; }

        public int SessionId { get; set; }

        public virtual Session Session { get; set; }

        public string Author { get; set; }

        public bool IsActive { get; set; }

        //public int ApplicationUserId { get; set; }

        //public virtual ApplicationUser ApplicationUser { get; set; }
    }
}
