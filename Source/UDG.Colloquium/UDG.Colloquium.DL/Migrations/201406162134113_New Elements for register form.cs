namespace UDG.Colloquium.DL.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class NewElementsforregisterform : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Works",
                c => new
                    {
                        WorkId = c.Int(nullable: false, identity: true),
                        WorkPosition = c.String(),
                        WorkDescription = c.String(),
                        Salary = c.Double(nullable: false),
                        SalarySchema = c.String(),
                        BeginDate = c.DateTime(nullable: false),
                        EndDate = c.DateTime(nullable: false),
                        ApplicationUserId = c.Int(nullable: false),
                        CompanyId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.WorkId)
                .ForeignKey("dbo.Users", t => t.ApplicationUserId, cascadeDelete: true)
                .ForeignKey("dbo.Companies", t => t.CompanyId, cascadeDelete: true)
                .Index(t => t.ApplicationUserId)
                .Index(t => t.CompanyId);
            
            CreateTable(
                "dbo.Companies",
                c => new
                    {
                        CompanyId = c.Int(nullable: false, identity: true),
                        CompanyCorporateName = c.String(),
                        CompanyDescription = c.String(),
                        CompanyAddress = c.String(),
                        CompanyPhoneNumber = c.String(),
                    })
                .PrimaryKey(t => t.CompanyId);
            
            AddColumn("dbo.Users", "LastName", c => c.String());
            AddColumn("dbo.Users", "MiddleName", c => c.String());
            AddColumn("dbo.Users", "BirthDate", c => c.DateTime(nullable: false));
            AddColumn("dbo.Users", "BirthPlace", c => c.String());
            AddColumn("dbo.Users", "Genre", c => c.Int(nullable: false));
            AddColumn("dbo.Users", "Nacionality", c => c.String());
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Works", "CompanyId", "dbo.Companies");
            DropForeignKey("dbo.Works", "ApplicationUserId", "dbo.Users");
            DropIndex("dbo.Works", new[] { "CompanyId" });
            DropIndex("dbo.Works", new[] { "ApplicationUserId" });
            DropColumn("dbo.Users", "Nacionality");
            DropColumn("dbo.Users", "Genre");
            DropColumn("dbo.Users", "BirthPlace");
            DropColumn("dbo.Users", "BirthDate");
            DropColumn("dbo.Users", "MiddleName");
            DropColumn("dbo.Users", "LastName");
            DropTable("dbo.Companies");
            DropTable("dbo.Works");
        }
    }
}
