namespace UDG.Colloquium.DL.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Initial2 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Comments", "Author", c => c.String());
            DropColumn("dbo.Comments", "CommentAutor");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Comments", "CommentAutor", c => c.String());
            DropColumn("dbo.Comments", "Author");
        }
    }
}
