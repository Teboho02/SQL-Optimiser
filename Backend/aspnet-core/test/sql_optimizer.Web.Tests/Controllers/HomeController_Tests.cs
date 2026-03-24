using sql_optimizer.Models.TokenAuth;
using sql_optimizer.Web.Controllers;
using Shouldly;
using System.Threading.Tasks;
using Xunit;

namespace sql_optimizer.Web.Tests.Controllers;

public class HomeController_Tests : sql_optimizerWebTestBase
{
    [Fact]
    public async Task Index_Test()
    {
        await AuthenticateAsync(null, new AuthenticateModel
        {
            UserNameOrEmailAddress = "admin",
            Password = "123qwe"
        });

        //Act
        var response = await GetResponseAsStringAsync(
            GetUrl<HomeController>(nameof(HomeController.Index))
        );

        //Assert
        response.ShouldNotBeNullOrEmpty();
    }
}