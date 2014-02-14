using System;
using System.Collections.Generic;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;

namespace UDG.Colloquium.Helpers
{
    public class BaseController : Controller
    {
        protected void AddErrors(IdentityResult result)
        {
            TempData["error"] = result.Errors;
        }
        protected void AddErrors(string error)
        {
            TempData["error"] = error;
        }

        protected void AddErrors(List<IdentityResult> errors)
        {
            TempData["error"] = errors;
        }

        protected void AddMessages(string type, params string[] messages)
        {
            TempData[type] = messages;
        }
        protected void AddMessages(string type, string message)
        {
            TempData[type] = message;
        }

        protected void AddMessages(string type,List<string> messages)
        {
            TempData[type] = messages;
        }

        protected ActionResult RedirectToLocal(string returnUrl)
        {
            if (Url.IsLocalUrl(returnUrl))
            {
                return Redirect(returnUrl);
            }
            else
            {
                return RedirectToAction("Index", "Home");
            }
        }
	}
}