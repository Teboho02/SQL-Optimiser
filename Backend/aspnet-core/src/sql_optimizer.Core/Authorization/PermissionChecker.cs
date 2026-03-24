using Abp.Authorization;
using sql_optimizer.Authorization.Roles;
using sql_optimizer.Authorization.Users;

namespace sql_optimizer.Authorization;

public class PermissionChecker : PermissionChecker<Role, User>
{
    public PermissionChecker(UserManager userManager)
        : base(userManager)
    {
    }
}
