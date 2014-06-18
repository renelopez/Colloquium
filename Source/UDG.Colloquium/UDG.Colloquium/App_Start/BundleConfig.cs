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

            bundles.Add(new ScriptBundle("~/bundles/custom/colloquiumCore").Include(
                        "~/Scripts/colloquium.js"));

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
                      "~/Content/toastr.css",
                      "~/Content/breeze.directives.css",
                      "~/Content/kendo/kendo.common.min.css",
                      "~/Content/kendo/kendo.bootstrap.min.css"));

            bundles.Add(new StyleBundle("~/Content/PageList").Include(
                "~/Content/PagedList.css"));

            bundles.Add(new ScriptBundle("~/bundles/angular").Include(
                "~/Scripts/angular.js",
                "~/Scripts/angular-resource.js",
                "~/Scripts/angular-route.js",
                "~/Scripts/angular-animate.js",
                "~/Scripts/angular-animate.js",
                "~/Scripts/angular-sanitize.js",
                "~/Scripts/kendo.ui.core.min.js",
                "~/Scripts/angular-kendo.js"));

            bundles.Add(new ScriptBundle("~/bundles/angularBreeze").Include(
                "~/Scripts/breeze.min.js",
                "~/Scripts/breeze.angular.js",
                "~/Scripts/breeze.debug.js",
                "~/Scripts/breeze.directives.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/externalVendors").Include(
               "~/Scripts/moment.js",
               "~/Scripts/angular-ui/ui-bootstrap-tpls.js",
               "~/Scripts/spin.js",
               "~/Scripts/angular-ui-router.js"
               ));
            bundles.Add(new ScriptBundle("~/bundles/bootstraping").Include(
                "~/app/app.js",
                "~/app/config.js",
                "~/app/config.exceptionHandler.js",
                "~/app/config.route.js"
                ));
            bundles.Add(new ScriptBundle("~/bundles/common").Include(
               "~/app/common/common.js",
               "~/app/common/logger.js",
               "~/app/common/spinner.js",
               "~/app/common/bootstrap/bootstrap.dialog.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/app").Include(
                "~/app/register/register.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/services").Include(
                "~/app/services/model.js",
                "~/app/services/registerDatacontext.js",
                "~/app/services/directives.js",
                "~/app/services/entityManagerFactory.js"
                ));
        }
    }
}
