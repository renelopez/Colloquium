using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
using PagedList;

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

        protected PartialViewResult RenderTable<T,TU>(string sortOrder,string currentFilter,string filter,int? page,int pageSize,IEnumerable<T> model,string partialViewName, Func<T, TU> orderby)
        {
            ViewBag.CurrentSort = sortOrder;
            ViewBag.NameSortParam = sortOrder == "Name_desc" ? "" : "Name_desc";


            if (filter != null)
            {
                page = 1;
            }
            else
            {
                filter = currentFilter;
            }

            ViewBag.CurrentFilter = filter;



            switch (sortOrder)
            {
                case "Name_desc":
                    model = model.OrderByDescending(orderby);
                    break;
                default:
                    model = model.OrderBy(orderby);
                    break;

            }
            ViewBag.PageSize = pageSize;
            var pageNumber = page ?? 1;

            return PartialView(partialViewName, model.ToPagedList(pageNumber, pageSize));
            
        }
	}
}