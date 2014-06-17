namespace UDG.Colloquium.DL.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddedNullables : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Works", "BeginDate", c => c.DateTime());
            AlterColumn("dbo.Works", "EndDate", c => c.DateTime());
            AlterColumn("dbo.Users", "BirthDate", c => c.DateTime());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Users", "BirthDate", c => c.DateTime(nullable: false));
            AlterColumn("dbo.Works", "EndDate", c => c.DateTime(nullable: false));
            AlterColumn("dbo.Works", "BeginDate", c => c.DateTime(nullable: false));
        }
    }
}
