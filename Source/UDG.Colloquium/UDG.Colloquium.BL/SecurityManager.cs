using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using UDG.Colloquium.DL;
using UDG.Colloquium.DL.Custom;

namespace UDG.Colloquium.BL
{
    public class SecurityManager
    {
        public UserManager<ApplicationUser> UserManager { get; set; }
        public RoleManager<ApplicationRole> RoleManager { get; set; } 
        public SecurityManager(UserManager<ApplicationUser> userManager,RoleManager<ApplicationRole> roleManager)
        {
            UserManager = userManager;
            RoleManager = roleManager;
        }

        public async Task<IdentityResult> CreateRoleAsync(string roleName)
        {
            IdentityResult roleResult;
            if (!await RoleManager.RoleExistsAsync(roleName))
            {
                roleResult = await RoleManager.CreateAsync(new ApplicationRole(roleName));
            }
            else
            {
                roleResult=new IdentityResult("Following role already exists:"+roleName);
            }
            return roleResult;
        }
    }
}
