using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using PagedList;
using UDG.Colloquium.App_Start;
using UDG.Colloquium.BL;
using UDG.Colloquium.BL.Entities.Account;
using UDG.Colloquium.BL.Managers;
using UDG.Colloquium.BL.ViewModels.Account.Management;
using UDG.Colloquium.BL.ViewModels.Account.Register;
using UDG.Colloquium.DL.Custom;
using UDG.Colloquium.DL.Custom.Roles;
using UDG.Colloquium.DL.Custom.Users;
using UDG.Colloquium.Helpers;
using UDG.Colloquium.ViewModels.Account;

namespace UDG.Colloquium.Controllers
{
    [Authorize]
    public class AccountController : BaseController
    {
        public AccountController()
        {
        }

        public AccountController(SecurityUserManager userManager,SecurityRoleManager roleManager)
        {
            UserManager = userManager;
            RoleManager = roleManager;
        }

        private SecurityUserManager _userManager;
        public SecurityUserManager UserManager
        {
            get
            {
                return _userManager ?? HttpContext.GetOwinContext().GetUserManager<SecurityUserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }

        private SecurityRoleManager _roleManager;
        public SecurityRoleManager RoleManager
        {
            get
            {
                return _roleManager ?? HttpContext.GetOwinContext().Get<SecurityRoleManager>();
            }
            private set
            {
                _roleManager = value;
            }
        }

        private SignInHelper _helper;

        private SignInHelper  SignInHelper
        {
            get
            {
                if (_helper == null)
                {
                    _helper = new SignInHelper(UserManager, AuthenticationManager);
                }
                return _helper;
            }
        }

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
        public async Task<ActionResult> Login(LoginVm model, string returnUrl)
        {
            if (ModelState.IsValid)
            {

                var user = await UserManager.FindAsync(model.UserName, model.Password);
                if (user != null)
                {
                    await SignInHelper.SignInAsync(user, model.RememberMe);
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
        public async Task<ActionResult> Register(RegisterVm model)
        {
            if (ModelState.IsValid)
            {
                var resultAccount = await UserManager.CreateUserAsync(model);
                if (resultAccount.Succeeded)
                {
                    var createdUser = await UserManager.FindByNameAsync(model.UserName);
                    await SignInHelper.SignInAsync(createdUser, isPersistent: false);
                    return RedirectToAction("Index", "Home");
                }
                AddErrors(resultAccount);
            }

            // If we got this far, something failed, redisplay form
            return View(model);
        }

        public PartialViewResult Companies()
        {
            var companies=new List<CompanyVm>
            {
                new CompanyVm
                {
                    CompanyId = 1,
                    CompanyName = "Unosquare",
                    CompanyAddress = "Americas23443",
                    CompanyCorporateName = "Tacsa",
                    CompanyDescription = "Apesta",
                    CompanyPhoneNumber = "34313343"
                },
                new CompanyVm
                {
                    CompanyId = 2,
                    CompanyName = "Tata",
                    CompanyAddress = "Iteso",
                    CompanyCorporateName = "Tacsa",
                    CompanyDescription = "Apesta 100",
                    CompanyPhoneNumber = "34313343"
                },
                new CompanyVm
                {
                    CompanyId = 3,
                    CompanyName = "HP",
                    CompanyAddress = "Iteso",
                    CompanyCorporateName = "Tacsa",
                    CompanyDescription = "Apesta",
                    CompanyPhoneNumber = "34313343"
                },
                new CompanyVm
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

        [Route("Account/IsUserAvailable/{userName}")]
        public async Task<JsonResult> IsUserAvailable(string userName)
        {
            var user= await UserManager.FindByNameAsync(userName);
            if (user==null)
            {
                return Json(true, JsonRequestBehavior.AllowGet);
            }
            return Json(false, JsonRequestBehavior.AllowGet);
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
        public async Task<ActionResult> Manage(ManageUserVm model)
        {
            bool hasPassword = HasPassword();
            ViewBag.HasLocalPassword = hasPassword;
            ViewBag.ReturnUrl = Url.Action("Manage");
            if (hasPassword)
            {
                if (ModelState.IsValid)
                {
                    IdentityResult result = await UserManager.ChangePasswordAsync(Convert.ToInt32(User.Identity.GetUserId()), model.OldPassword, model.NewPassword);
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
                    IdentityResult result = await UserManager.AddPasswordAsync(Convert.ToInt32(User.Identity.GetUserId()), model.NewPassword);
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
            IEnumerable<UserNamesDao> usersWithRoles;


            if (String.IsNullOrEmpty(userName))
            {

                usersWithRoles = await UserManager.GetAllUserNamesAsync();
            }
            else
            {
                usersWithRoles = await UserManager.FindUserNameAsync(userName);
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

        public async Task<ActionResult> EditUserRoles(int id, string userName)
        {
            var userRoles = await UserManager.GetRolesAsync(id);
            var allRoles = await RoleManager.Roles.ToListAsync();
            var userViewModel = new UserRolesDao
            {
                Id = id,
                UserName = userName,
                UserRoles = new List<SelectedRolesVm>()
            };
            foreach (var role in allRoles)
            {
                userViewModel.UserRoles.Add(userRoles.Contains(role.Name)
                    ? new SelectedRolesVm() { RoleName = role.Name, Selected = true }
                    : new SelectedRolesVm() { RoleName = role.Name });
            }

            return View(userViewModel);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> EditUserRoles(UserRolesDao userRolesDao)
        {
            var success = new List<string>();
            var failed =new List<IdentityResult>();
            foreach (var selectedRole in userRolesDao.UserRoles)
            {
                if (selectedRole.Selected)
                {
                    if (!await UserManager.IsInRoleAsync(userRolesDao.Id, selectedRole.RoleName))
                    {
                        IdentityResult result =
                            await
                                UserManager.AddToRoleAsync(userRolesDao.Id, selectedRole.RoleName);
                        if (result.Succeeded)
                        {
                            success.Add("The role " + selectedRole.RoleName + " was assigned to the user " +
                                        userRolesDao.UserName);
                        }
                        else
                        {
                            failed.Add(result);
                        }
                    }
                }
                else
                {
                    if (await UserManager.IsInRoleAsync(userRolesDao.Id, selectedRole.RoleName))
                    {
                        IdentityResult result =
                           await
                               UserManager.RemoveFromRoleAsync(userRolesDao.Id, selectedRole.RoleName);
                        if (result.Succeeded)
                        {
                            success.Add("The role " + selectedRole.RoleName + " was removed to the user " +
                                        userRolesDao.UserName);
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
            return View("EditUserRoles",userRolesDao);
        }

        public async Task<ActionResult> ManageRoles()
        {
            var roles = await RoleManager.GetRolesAsync();
            return View(roles);

        }

        public ActionResult CreateRole()
        {
            ViewBag.ReturnUrl = Url.Action("CreateRole");
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> CreateRole(RoleNamesDao roleNamesDao)
        {
            if (ModelState.IsValid)
            {
                IdentityResult result = await RoleManager.CreateRoleAsync(roleNamesDao.RoleName);
                if (result.Succeeded)
                {
                    AddMessages("info", "Following role was created:" + roleNamesDao.RoleName);
                    AddMessages("success", "Role was created succesfully");
                    return RedirectToAction("ManageRoles");
                }
                else
                {
                    AddErrors(result);
                }
            }
            return View(roleNamesDao);
        }

        public async Task<ActionResult> DeleteRole(int id, string roleName)
        {
            IdentityResult result = await RoleManager.RemoveRoleAsync(roleName);
            if (result.Succeeded)
            {
                AddMessages("info", "Following role was deleted:" + roleName);
            }
            else
            {
                AddErrors(result);
            }
            return RedirectToAction("ManageRoles");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing && UserManager != null &&RoleManager!=null)
            {
                UserManager.Dispose();
                UserManager = null;
                RoleManager.Dispose();
                RoleManager = null;
                
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

        private bool HasPassword()
        {
            var user = UserManager.FindById(Convert.ToInt32(User.Identity.GetUserId()));
            if (user != null)
            {
                return user.PasswordHash != null;
            }
            return false;
        }
    }
}