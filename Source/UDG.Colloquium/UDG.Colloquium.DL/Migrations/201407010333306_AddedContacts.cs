namespace UDG.Colloquium.DL.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddedContacts : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Contacts",
                c => new
                    {
                        ContactId = c.Int(nullable: false, identity: true),
                        ContactType = c.Int(nullable: false),
                        ContactInfo = c.String(),
                        ApplicationUserId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.ContactId)
                .ForeignKey("dbo.Users", t => t.ApplicationUserId, cascadeDelete: true)
                .Index(t => t.ApplicationUserId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Contacts", "ApplicationUserId", "dbo.Users");
            DropIndex("dbo.Contacts", new[] { "ApplicationUserId" });
            DropTable("dbo.Contacts");
        }
    }
}
