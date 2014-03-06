namespace UDG.Colloquium.DL.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class InitialCreate : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Roles",
                c => new
                    {
                        Id = c.String(nullable: false, maxLength: 128, unicode: false, storeType: "nvarchar"),
                        Name = c.String(nullable: false, unicode: false),
                        Discriminator = c.String(nullable: false, maxLength: 128, unicode: false, storeType: "nvarchar"),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Users",
                c => new
                    {
                        Id = c.String(nullable: false, maxLength: 128, unicode: false, storeType: "nvarchar"),
                        UserName = c.String(nullable: false, unicode: false),
                        PasswordHash = c.String(unicode: false),
                        SecurityStamp = c.String(unicode: false),
                        Discriminator = c.String(nullable: false, maxLength: 128, unicode: false, storeType: "nvarchar"),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.UserRoles",
                c => new
                    {
                        UserId = c.String(nullable: false, maxLength: 128, unicode: false, storeType: "nvarchar"),
                        RoleId = c.String(nullable: false, maxLength: 128, unicode: false, storeType: "nvarchar"),
                    })
                .PrimaryKey(t => new { t.UserId, t.RoleId })
                .ForeignKey("dbo.Roles", t => t.RoleId, cascadeDelete: true)
                .ForeignKey("dbo.Users", t => t.UserId, cascadeDelete: true)
                .Index(t => t.RoleId)
                .Index(t => t.UserId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.UserRoles", "UserId", "dbo.Users");
            DropForeignKey("dbo.UserRoles", "RoleId", "dbo.Roles");
            DropIndex("dbo.UserRoles", new[] { "UserId" });
            DropIndex("dbo.UserRoles", new[] { "RoleId" });
            DropTable("dbo.UserRoles");
            DropTable("dbo.Users");
            DropTable("dbo.Roles");
        }
    }
}
