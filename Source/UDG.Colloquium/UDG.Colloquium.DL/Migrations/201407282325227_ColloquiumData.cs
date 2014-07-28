namespace UDG.Colloquium.DL.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ColloquiumData : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Colloquiums",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Period = c.String(nullable: false),
                        BeginDate = c.DateTime(nullable: false),
                        EndDate = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            AddColumn("dbo.Users", "ColloquiumID", c => c.Int(nullable: false));
            CreateIndex("dbo.Users", "ColloquiumID");
            AddForeignKey("dbo.Users", "ColloquiumID", "dbo.Colloquiums", "Id", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Users", "ColloquiumID", "dbo.Colloquiums");
            DropIndex("dbo.Users", new[] { "ColloquiumID" });
            DropColumn("dbo.Users", "ColloquiumID");
            DropTable("dbo.Colloquiums");
        }
    }
}
