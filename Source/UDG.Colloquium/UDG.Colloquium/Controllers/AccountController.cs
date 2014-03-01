﻿using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNet.Identity;
using Microsoft.Owin.Security;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using PagedList;
using UDG.Colloquium.BL;
using UDG.Colloquium.BL.ViewModels;
using UDG.Colloquium.DL.Custom;
using UDG.Colloquium.Helpers;
using WebGrease.Css.Extensions;
using System.Globalization;

namespace UDG.Colloquium.Controllers
{
    [Authorize]
    public class AccountController : BaseController
    {
        public AccountController(ISecurityManager<ApplicationUser, ApplicationRole> securityManager)
        {
            SecurityManager = securityManager;
        }

        public ISecurityManager<ApplicationUser, ApplicationRole> SecurityManager { get; set; }

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
                ModelState.AddModelError("", "Invalid username or password.");
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
                AddErrors(resultAccount);
            }

            // If we got this far, something failed, redisplay form
            return View(model);
        }

        public PartialViewResult Companies()
        {
            var companies=new List<CompanyViewModel>
            {
                new CompanyViewModel
                {
                    CompanyId = 1,
                    CompanyName = "Unosquare",
                    CompanyAddress = "Americas23443",
                    CompanyCorporateName = "Tacsa",
                    CompanyDescription = "Apesta",
                    CompanyPhoneNumber = "34313343"
                },
                new CompanyViewModel
                {
                    CompanyId = 2,
                    CompanyName = "Tata",
                    CompanyAddress = "Iteso",
                    CompanyCorporateName = "Tacsa",
                    CompanyDescription = "Apesta 100",
                    CompanyPhoneNumber = "34313343"
                },
                new CompanyViewModel
                {
                    CompanyId = 3,
                    CompanyName = "HP",
                    CompanyAddress = "Iteso",
                    CompanyCorporateName = "Tacsa",
                    CompanyDescription = "Apesta",
                    CompanyPhoneNumber = "34313343"
                },
                new CompanyViewModel
                {
                    CompanyId = 4,
                    CompanyName = "Oracle",
                    CompanyAddress = "Puerta de Hierro",
                    CompanyCorporateName = "Oracle",
                    CompanyDescription = "Esta mejor",
                    CompanyPhoneNumber = "34313343"
                }

                
            };

            return PartialView("_CompanyCatalogPartial", companies);
        }

        public async Task<JsonResult> IsUserAvailable(string userName)
        {
            var user= await SecurityManager.UserManager.FindByNameAsync(userName);
            if (user==null)
            {
                return Json(true, JsonRequestBehavior.AllowGet);
            }

            string unavailableUserMessage = String.Format(CultureInfo.InvariantCulture, "{0} is not available.", userName);
            return Json(unavailableUserMessage, JsonRequestBehavior.AllowGet);
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

            // If we got this far, something failed, redisplay form
            return View(model);
        }
        //
        // POST: /Account/LogOff
        [HttpPost]
        [ValidateAntiForgeryToken]
        [Authorize]
        public ActionResult LogOff()
        {
            AuthenticationManager.SignOut();
            return RedirectToAction("Index", "Home");
        }

        //[Authorize(Roles="Administrator")]
        [Authorize]
        public async Task<ActionResult> ManageUsers(string userName,int page=1,string order="asc")
        {
            IEnumerable<UserNamesViewModel> usersWithRoles;


            if (String.IsNullOrEmpty(userName))
            {

                usersWithRoles = await SecurityManager.GetAllUserNamesAsync();
            }
            else
            {
                usersWithRoles = await SecurityManager.FindUserNameAsync(userName);
            }

            if (Request.IsAjaxRequest())
            {
                ViewBag.Order = order=="asc"?"desc":"asc";
                switch (order)
                {
                    case "desc":
                        usersWithRoles = usersWithRoles.OrderByDescending(usr => usr.UserName);
                        break;
                    default:
                        usersWithRoles = usersWithRoles.OrderBy(usr => usr.UserName);
                        break;
                }

                return PartialView("_UsersListPartial", usersWithRoles.ToPagedList(page, 5));
            }

            return View(usersWithRoles.ToPagedList(page,5));
        }

        public async Task<ActionResult> EditUserRoles(string id, string userName)
        {
            var userRole = await SecurityManager.GetUserRolesAsync(id, userName);
            return View(userRole);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> EditUserRoles(UserRolesViewModel userRolesViewModel)
        {
            var success = new List<string>();
            var failed =new List<IdentityResult>();
            foreach (var selectedRole in userRolesViewModel.UserRoles)
            {
                if (selectedRole.Selected)
                {
                    if (!await SecurityManager.UserManager.IsInRoleAsync(userRolesViewModel.Id, selectedRole.RoleName))
                    {
                        IdentityResult result =
                            await
                                SecurityManager.UserManager.AddToRoleAsync(userRolesViewModel.Id, selectedRole.RoleName);
                        if (result.Succeeded)
                        {
                            success.Add("The role " + selectedRole.RoleName + " was assigned to the user " +
                                        userRolesViewModel.UserName);
                        }
                        else
                        {
                            failed.Add(result);
                        }
                    }
                }
                else
                {
                    if (await SecurityManager.UserManager.IsInRoleAsync(userRolesViewModel.Id, selectedRole.RoleName))
                    {
                        IdentityResult result =
                           await
                               SecurityManager.UserManager.RemoveFromRoleAsync(userRolesViewModel.Id, selectedRole.RoleName);
                        if (result.Succeeded)
                        {
                            success.Add("The role " + selectedRole.RoleName + " was removed to the user " +
                                        userRolesViewModel.UserName);
                        }
                        else
                        {
                            failed.Add(result);
                        }
                    }
                }
            }
            if (success.Count > 0)
            {
                AddMessages("info",success);
            }
            if (failed.Count > 0)
            {
                AddErrors(failed);
            }
            return View("EditUserRoles",userRolesViewModel);
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
                    AddMessages("info", "Following role was created:" + roleNamesViewModel.RoleName);
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
            var successList=new List<string>();
            var errorList = new List<IdentityResult>();

            // Removing users asigned to that role.
            var result = await SecurityManager.RemoveUsersFromRoleAsync(roleName);

            // If there are some errors.Print them out.
            if (result != null)
            {
                if (result.Any(res => !res.Succeeded))
                {
                    var errors = result.Where(res => !res.Succeeded).ToList();
                    errorList.AddRange(errors);
                }
                else
                {
                    successList.Add("Users for role:" + roleName + " were succesfully unassigned.");
                }
            }
            // Removing the role.
            var recordsAffected = await SecurityManager.RemoveRoleAsync(id, roleName);

            // If records were affected show message to the page.
            if (recordsAffected > 0)
            {
                successList.Add("The " + roleName + " role was succesfully removed.");
            }

            else
            {
                errorList.Add(new IdentityResult("An error happened while removing the role."));
            }

            if (successList.Count > 0)
            {
                AddMessages("info",successList);
            }
            if (errorList.Count > 0)
            {
                AddErrors(errorList);
            }
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