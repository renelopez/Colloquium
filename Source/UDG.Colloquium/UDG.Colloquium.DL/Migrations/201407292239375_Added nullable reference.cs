namespace UDG.Colloquium.DL.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Addednullablereference : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Users", "ColloquiumId", "dbo.Colloquiums");
            DropIndex("dbo.Users", new[] { "ColloquiumId" });
            AlterColumn("dbo.Users", "ColloquiumId", c => c.Int());
            CreateIndex("dbo.Users", "ColloquiumId");
            AddForeignKey("dbo.Users", "ColloquiumId", "dbo.Colloquiums", "ColloquiumId");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Users", "ColloquiumId", "dbo.Colloquiums");
            DropIndex("dbo.Users", new[] { "ColloquiumId" });
            AlterColumn("dbo.Users", "ColloquiumId", c => c.Int(nullable: false));
            CreateIndex("dbo.Users", "ColloquiumId");
            AddForeignKey("dbo.Users", "ColloquiumId", "dbo.Colloquiums", "ColloquiumId", cascadeDelete: true);
        }
    }
}
