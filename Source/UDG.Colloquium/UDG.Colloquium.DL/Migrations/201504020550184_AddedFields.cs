namespace UDG.Colloquium.DL.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddedFields : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Colloquiums", "IsActive", c => c.Boolean(nullable: false));
            AddColumn("dbo.Sessions", "IsActive", c => c.Boolean(nullable: false));
            AddColumn("dbo.Users", "IsActive", c => c.Boolean(nullable: false));
            AddColumn("dbo.Roles", "IsActive", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Roles", "IsActive");
            DropColumn("dbo.Users", "IsActive");
            DropColumn("dbo.Sessions", "IsActive");
            DropColumn("dbo.Colloquiums", "IsActive");
        }
    }
}
