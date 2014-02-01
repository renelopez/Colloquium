using System;
using System.Collections.Generic;
using Microsoft.AspNet.Identity;
using Microsoft.Owin.Security;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using UDG.Colloquium.BL;
using UDG.Colloquium.DL.Custom;
using UDG.Colloquium.Helpers;
using UDG.Colloquium.Models;

namespace UDG.Colloquium.Controllers
{
    [Authorize]
    public class AccountController : BaseController
    {
        public AccountController(SecurityManager securityManager)
        {
            SecurityManager = securityManager;
        }

        public SecurityManager SecurityManager { get; set; }

        //
        // GET: /Account/Login
        [AllowAnonymous]
        public ActionResult Login(string returnUrl)
        {
            ViewBag.ReturnUrl = returnUrl;
            return View();
        }

        //
        // POST: /Account/Login
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Login(LoginViewModel model, string returnUrl)
        {
            if (ModelState.IsValid)
            {
                
                var user = await SecurityManager.UserManager.FindAsync(model.UserName, model.Password);
                if (user != null)
                {
                    await SignInAsync(user, model.RememberMe);
                    return RedirectToLocal(returnUrl);
                }
                else
                {
                    ModelState.AddModelError("", "Invalid username or password.");
                }
            }

            // If we got this far, something failed, redisplay form
            return View(model);
        }

        //
        // GET: /Account/Register
        [Authorize(Roles = "Administrator")]
        public ActionResult Register()
        {
            return View();
        }
        
        //
        // POST: /Account/Register
        [Authorize(Roles = "Administrator")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Register(RegisterViewModel model)
        {
            if (ModelState.IsValid)
            {

               var user = new ApplicationUser() { UserName = model.UserName};
                IdentityResult resultAccount = await SecurityManager.UserManager.CreateAsync(user, model.Password);
                if (resultAccount.Succeeded)
                {
                    await SignInAsync(user, isPersistent: false);
                    return RedirectToAction("Index", "Home");
                }
                else
                {
                    AddErrors(resultAccount);
                }
            }

            // If we got this far, something failed, redisplay form
            return View(model);
        }

        //
        // GET: /Account/Manage
        [Authorize(Roles = "Administrator,Student")]
        public ActionResult Manage()
        {
            ViewBag.HasLocalPassword = HasPassword();
            ViewBag.ReturnUrl = Url.Action("Manage");
            return View();
        }

        //
        // POST: /Account/Manage
        [HttpPost]
        [ValidateAntiForgeryToken]
        [Authorize(Roles = "Administrator,Student")]
        public async Task<ActionResult> Manage(ManageUserViewModel model)
        {
            bool hasPassword = HasPassword();
            ViewBag.HasLocalPassword = hasPassword;
            ViewBag.ReturnUrl = Url.Action("Manage");
            if (hasPassword)
            {
                if (ModelState.IsValid)
                {
                    IdentityResult result = await SecurityManager.UserManager.ChangePasswordAsync(User.Identity.GetUserId(), model.OldPassword, model.NewPassword);
                    if (result.Succeeded)
                    {
                        AddMessages("info", "Old Password:" + model.OldPassword, "New Password:" + model.NewPassword);
                        AddMessages("success", "Password was changed succesfully");
                        return RedirectToAction("Manage");
                    }
                    else
                    {
                        AddErrors(result);
                    }
                }
            }
            else
            {
                // User does not have a password so remove any validation errors caused by a missing OldPassword field
                ModelState state = ModelState["OldPassword"];
                if (state != null)
                {
                    state.Errors.Clear();
                }

                if (ModelState.IsValid)
                {
                    IdentityResult result = await SecurityManager.UserManager.AddPasswordAsync(User.Identity.GetUserId(), model.NewPassword);
                    if (result.Succeeded)
                    {

                        AddMessages("info","Old Password:"+ model.OldPassword,"New Password:" + model.NewPassword);
                        AddMessages("success","Password was changed succesfully");
                        return RedirectToAction("Manage");
                    }
                    else
                    {
                        AddErrors(result);
                    }
                }
            }

            // If we got this far, something failed, redisplay form
            return View(model);
        }
        //
        // POST: /Account/LogOff
        [HttpPost]
        [ValidateAntiForgeryToken]
        [Authorize(Roles = "Administrator,Student")]
        public ActionResult LogOff()
        {
            AuthenticationManager.SignOut();
            return RedirectToAction("Index", "Home");
        }

        [Authorize(Roles="Administrator")]
        public async Task<ActionResult> ManageUsers()
        {
            try
            {
                var users = await SecurityManager.GetUsersAsync();
                foreach (var user in users)
                {
                    Console.WriteLine(user.UserName);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.InnerException);
            }
            return View();
        }


        protected override void Dispose(bool disposing)
        {
            if (disposing && SecurityManager.UserManager != null)
            {
                SecurityManager.UserManager.Dispose();
                SecurityManager.UserManager = null;
                SecurityManager = null;
            }
            base.Dispose(disposing);
        }

        private IAuthenticationManager AuthenticationManager
        {
            get
            {
                return HttpContext.GetOwinContext().Authentication;
            }
        }

        private async Task SignInAsync(ApplicationUser user, bool isPersistent)
        {
            AuthenticationManager.SignOut(DefaultAuthenticationTypes.ExternalCookie);
            var identity = await SecurityManager.UserManager.CreateIdentityAsync(user, DefaultAuthenticationTypes.ApplicationCookie);
            AuthenticationManager.SignIn(new AuthenticationProperties() { IsPersistent = isPersistent }, identity);
        }

        private bool HasPassword()
        {
            var user = SecurityManager.UserManager.FindById(User.Identity.GetUserId());
            if (user != null)
            {
                return user.PasswordHash != null;
            }
            return false;
        }
    }
}