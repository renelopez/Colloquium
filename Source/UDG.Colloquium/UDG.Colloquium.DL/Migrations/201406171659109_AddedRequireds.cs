namespace UDG.Colloquium.DL.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddedRequireds : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Companies", "CompanyCorporateName", c => c.String(nullable: false));
            AlterColumn("dbo.Companies", "CompanyDescription", c => c.String(nullable: false));
            AlterColumn("dbo.Companies", "CompanyAddress", c => c.String(nullable: false));
            AlterColumn("dbo.Companies", "CompanyPhoneNumber", c => c.String(nullable: false));
            AlterColumn("dbo.Works", "WorkPosition", c => c.String(nullable: false));
            AlterColumn("dbo.Works", "WorkDescription", c => c.String(nullable: false));
            AlterColumn("dbo.Works", "SalarySchema", c => c.String(nullable: false));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Works", "SalarySchema", c => c.String());
            AlterColumn("dbo.Works", "WorkDescription", c => c.String());
            AlterColumn("dbo.Works", "WorkPosition", c => c.String());
            AlterColumn("dbo.Companies", "CompanyPhoneNumber", c => c.String());
            AlterColumn("dbo.Companies", "CompanyAddress", c => c.String());
            AlterColumn("dbo.Companies", "CompanyDescription", c => c.String());
            AlterColumn("dbo.Companies", "CompanyCorporateName", c => c.String());
        }
    }
}
