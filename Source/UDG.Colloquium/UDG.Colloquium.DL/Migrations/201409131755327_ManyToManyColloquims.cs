namespace UDG.Colloquium.DL.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ManyToManyColloquims : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Users", "ColloquiumId", "dbo.Colloquiums");
            DropIndex("dbo.Users", new[] { "ColloquiumId" });
            CreateTable(
                "dbo.ApplicationUserColloquiums",
                c => new
                    {
                        ApplicationUser_Id = c.Int(nullable: false),
                        Colloquium_ColloquiumId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => new { t.ApplicationUser_Id, t.Colloquium_ColloquiumId })
                .ForeignKey("dbo.Users", t => t.ApplicationUser_Id, cascadeDelete: true)
                .ForeignKey("dbo.Colloquiums", t => t.Colloquium_ColloquiumId, cascadeDelete: true)
                .Index(t => t.ApplicationUser_Id)
                .Index(t => t.Colloquium_ColloquiumId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.ApplicationUserColloquiums", "Colloquium_ColloquiumId", "dbo.Colloquiums");
            DropForeignKey("dbo.ApplicationUserColloquiums", "ApplicationUser_Id", "dbo.Users");
            DropIndex("dbo.ApplicationUserColloquiums", new[] { "Colloquium_ColloquiumId" });
            DropIndex("dbo.ApplicationUserColloquiums", new[] { "ApplicationUser_Id" });
            DropTable("dbo.ApplicationUserColloquiums");
            CreateIndex("dbo.Users", "ColloquiumId");
            AddForeignKey("dbo.Users", "ColloquiumId", "dbo.Colloquiums", "ColloquiumId");
        }
    }
}
