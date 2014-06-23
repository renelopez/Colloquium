namespace UDG.Colloquium.DL.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Addedmorerules : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Companies", "CompanyCorporateName", c => c.String(nullable: false, maxLength: 30));
            AlterColumn("dbo.Companies", "CompanyDescription", c => c.String(nullable: false, maxLength: 100));
            AlterColumn("dbo.Companies", "CompanyAddress", c => c.String(nullable: false, maxLength: 30));
            AlterColumn("dbo.Works", "WorkPosition", c => c.String(nullable: false, maxLength: 20));
            AlterColumn("dbo.Works", "WorkDescription", c => c.String(nullable: false, maxLength: 100));
            AlterColumn("dbo.Works", "SalarySchema", c => c.String(nullable: false, maxLength: 20));
            AlterColumn("dbo.Users", "LastName", c => c.String(nullable: false, maxLength: 30));
            AlterColumn("dbo.Users", "MiddleName", c => c.String(maxLength: 20));
            AlterColumn("dbo.Users", "FirstName", c => c.String(nullable: false, maxLength: 20));
            AlterColumn("dbo.Users", "BirthPlace", c => c.String(nullable: false));
            AlterColumn("dbo.Users", "Nacionality", c => c.String(nullable: false));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Users", "Nacionality", c => c.String());
            AlterColumn("dbo.Users", "BirthPlace", c => c.String());
            AlterColumn("dbo.Users", "FirstName", c => c.String(nullable: false, maxLength: 10));
            AlterColumn("dbo.Users", "MiddleName", c => c.String());
            AlterColumn("dbo.Users", "LastName", c => c.String(nullable: false, maxLength: 5));
            AlterColumn("dbo.Works", "SalarySchema", c => c.String(nullable: false));
            AlterColumn("dbo.Works", "WorkDescription", c => c.String(nullable: false));
            AlterColumn("dbo.Works", "WorkPosition", c => c.String(nullable: false));
            AlterColumn("dbo.Companies", "CompanyAddress", c => c.String(nullable: false));
            AlterColumn("dbo.Companies", "CompanyDescription", c => c.String(nullable: false));
            AlterColumn("dbo.Companies", "CompanyCorporateName", c => c.String(nullable: false));
        }
    }
}
