using System.Web.Mvc;
using UDG.Colloquium.Helpers;

namespace UDG.Colloquium.Controllers
{
    [RoutePrefix("bootstrap")]
    public class BootstrapController : BaseController
    {
        [Route]
        public ActionResult Index()
        {
            return View();
        }
    }
}