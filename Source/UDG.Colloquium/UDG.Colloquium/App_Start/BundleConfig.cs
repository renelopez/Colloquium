using System.Web.Optimization;

namespace UDG.Colloquium.App_Start
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                "~/Scripts/jquery-{version}.js",
                "~/Scripts/jquery.unobtrusive*",
                "~/Scripts/toastr.js"));

            bundles.Add(new ScriptBundle("~/bundles/custom/colloquiumList").Include(
                        "~/Scripts/colloquiumList.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/animate.css",
                      "~/Content/site.css",
                      "~/Content/toastr.css"));

            bundles.Add(new StyleBundle("~/Content/PageList").Include(
                "~/Content/PagedList.css"));

            bundles.Add(new ScriptBundle("~/bundles/angular").Include(
                "~/Scripts/angular.js",
                "~/Scripts/angular-resource.js",
                "~/Scripts/angular-route.js",
                "~/Scripts/angular-animate.js"));

            bundles.Add(new ScriptBundle("~/bundles/angular/main").Include(
                "~/app/app.js"));

            bundles.Add(new ScriptBundle("~/bundles/angular/register").Include(
                "~/app/modules/registerModule.js",
                "~/app/services/workFactory.js",
                "~/app/controllers/workController.js",
                "~/app/services/contactFactory.js",
                "~/app/controllers/contactController.js"));
        }
    }
}
