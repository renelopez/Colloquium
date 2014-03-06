using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace UDG.Colloquium.Controllers
{
    public class ErrorController : Controller
    {
        //
        // GET: /Error/
        public ActionResult HandleTheError(object error)
        {
            return View(error);
        }
	}
}