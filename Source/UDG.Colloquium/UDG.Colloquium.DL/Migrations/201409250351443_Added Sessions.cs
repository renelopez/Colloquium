namespace UDG.Colloquium.DL.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddedSessions : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.ApplicationUserColloquiums", "ApplicationUser_Id", "dbo.Users");
            DropForeignKey("dbo.ApplicationUserColloquiums", "Colloquium_Id", "dbo.Colloquiums");
            DropIndex("dbo.ApplicationUserColloquiums", new[] { "ApplicationUser_Id" });
            DropIndex("dbo.ApplicationUserColloquiums", new[] { "Colloquium_Id" });
            CreateTable(
                "dbo.Sessions",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Description = c.String(nullable: false),
                        Name = c.String(nullable: false),
                        ColloquiumId = c.Int(nullable: false),
                        ApplicationUserId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Users", t => t.ApplicationUserId, cascadeDelete: true)
                .ForeignKey("dbo.Colloquiums", t => t.ColloquiumId, cascadeDelete: true)
                .Index(t => t.ColloquiumId)
                .Index(t => t.ApplicationUserId);
            
            AddColumn("dbo.Colloquiums", "ApplicationUser_Id", c => c.Int());
            CreateIndex("dbo.Colloquiums", "ApplicationUser_Id");
            AddForeignKey("dbo.Colloquiums", "ApplicationUser_Id", "dbo.Users", "Id");
            DropTable("dbo.ApplicationUserColloquiums");
        }
        
        public override void Down()
        {
            CreateTable(
                "dbo.ApplicationUserColloquiums",
                c => new
                    {
                        ApplicationUser_Id = c.Int(nullable: false),
                        Colloquium_Id = c.Int(nullable: false),
                    })
                .PrimaryKey(t => new { t.ApplicationUser_Id, t.Colloquium_Id });
            
            DropForeignKey("dbo.Sessions", "ColloquiumId", "dbo.Colloquiums");
            DropForeignKey("dbo.Sessions", "ApplicationUserId", "dbo.Users");
            DropForeignKey("dbo.Colloquiums", "ApplicationUser_Id", "dbo.Users");
            DropIndex("dbo.Sessions", new[] { "ApplicationUserId" });
            DropIndex("dbo.Sessions", new[] { "ColloquiumId" });
            DropIndex("dbo.Colloquiums", new[] { "ApplicationUser_Id" });
            DropColumn("dbo.Colloquiums", "ApplicationUser_Id");
            DropTable("dbo.Sessions");
            CreateIndex("dbo.ApplicationUserColloquiums", "Colloquium_Id");
            CreateIndex("dbo.ApplicationUserColloquiums", "ApplicationUser_Id");
            AddForeignKey("dbo.ApplicationUserColloquiums", "Colloquium_Id", "dbo.Colloquiums", "Id", cascadeDelete: true);
            AddForeignKey("dbo.ApplicationUserColloquiums", "ApplicationUser_Id", "dbo.Users", "Id", cascadeDelete: true);
        }
    }
}
