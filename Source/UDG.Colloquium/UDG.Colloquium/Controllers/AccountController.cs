using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNet.Identity;
using Microsoft.Owin.Security;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using UDG.Colloquium.BL;
using UDG.Colloquium.BL.ViewModels;
using UDG.Colloquium.DL.Custom;
using UDG.Colloquium.Helpers;
using WebGrease.Css.Extensions;

namespace UDG.Colloquium.Controllers
{
    [Authorize]
    public class AccountController : BaseController
    {
        public AccountController(ISecurityManager<ApplicationUser,ApplicationRole> securityManager)
        {
            SecurityManager = securityManager;
        }

        public ISecurityManager<ApplicationUser,ApplicationRole> SecurityManager { get; set; }

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
        //[Authorize(Roles = "Administrator")]
        public ActionResult Register()
        {
            return View();
        }
        
        //
        // POST: /Account/Register
        //[Authorize(Roles = "Administrator")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Register(RegisterViewModel model)
        {
            if (ModelState.IsValid)
            {
                var resultAccount = await SecurityManager.CreateUserAsync(model);
                if (resultAccount.Succeeded)
                {
                    var createdUser = await SecurityManager.UserManager.FindByNameAsync(model.UserName);
                    await SignInAsync(createdUser, isPersistent: false);
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

        //[Authorize(Roles="Administrator")]
        [Authorize]
        public async Task<ActionResult> ManageUsers()
        {
            var usersWithRoles = await SecurityManager.GetUserNamesAsync();
            return View(usersWithRoles);
        }

        public async Task<ActionResult> EditUserRoles(string id,string userName)
        {
            var userRole = await SecurityManager.GetUserRolesAsync(id,userName);
            return View(userRole);
        }

        public async Task<ActionResult> ManageRoles()
        {
            var roles = await SecurityManager.GetRolesAsync();
            return View(roles);

        }

        public ActionResult CreateRole()
        {
            ViewBag.ReturnUrl = Url.Action("CreateRole");
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> CreateRole(RoleNamesViewModel roleNamesViewModel)
        {
            if (ModelState.IsValid)
            {
                IdentityResult result = await SecurityManager.CreateRoleAsync(roleNamesViewModel.RoleName);
                if (result.Succeeded)
                {
                    AddMessages("info", "Following role was created:"+roleNamesViewModel.RoleName);
                    AddMessages("success", "Role was created succesfully");
                    return RedirectToAction("ManageRoles");
                }
                else
                {
                    AddErrors(result);
                }
            }
            return View(roleNamesViewModel);
        }

        public async Task<ActionResult> DeleteRole(string id, string roleName)
        {
            var result = await SecurityManager.RemoveUsersFromRoleAsync(roleName);
            if (result != null)
            {
                if (result.Any(res => !res.Succeeded))
                {
                    result.Where(res => !res.Succeeded).ForEach(AddErrors);
                }
            }
                AddMessages("success", "Users for role:" + roleName + " were succesfully unassigned.");
                SecurityManager.RemoveRoleAsync(id, roleName);
                AddMessages("success", "Role:" + roleName + " was succesfully unassigned.");

            return RedirectToAction("ManageRoles");
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