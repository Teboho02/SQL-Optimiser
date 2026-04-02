using Abp.Runtime.Security;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace sql_optimizer.Web.Host.Startup
{
    public static class AuthConfigurer
    {
        public static void Configure(IServiceCollection services, IConfiguration configuration)
        {
            if (bool.Parse(configuration["Authentication:JwtBearer:IsEnabled"]))
            {
                services.AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = "JwtBearer";
                    options.DefaultChallengeScheme = "JwtBearer";
                }).AddJwtBearer("JwtBearer", options =>
                {
                    options.Audience = configuration["Authentication:JwtBearer:Audience"];

                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        // The signing key must match!
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(configuration["Authentication:JwtBearer:SecurityKey"])),

                        // Validate the JWT Issuer (iss) claim
                        ValidateIssuer = true,
                        ValidIssuer = configuration["Authentication:JwtBearer:Issuer"],

                        // Validate the JWT Audience (aud) claim
                        ValidateAudience = true,
                        ValidAudience = configuration["Authentication:JwtBearer:Audience"],

                        // Validate the token expiry
                        ValidateLifetime = true,

                        // If you want to allow a certain amount of clock drift, set that here
                        ClockSkew = TimeSpan.Zero
                    };

                    options.Events = new JwtBearerEvents
                    {
                        OnMessageReceived = TokenResolver
                    };
                });
            }
        }

        /// <summary>
        /// Resolves the JWT from either the request cookie (all clients) or the SignalR
        /// encrypted query-string token (SignalR clients that cannot send headers).
        /// Cookie-based auth takes priority; the Authorization header is still honoured
        /// automatically by the JwtBearer middleware when neither source provides a token.
        /// </summary>
        private static Task TokenResolver(MessageReceivedContext context)
        {
            // SignalR clients pass the token as an encrypted query-string value.
            if (context.HttpContext.Request.Path.HasValue &&
                context.HttpContext.Request.Path.Value.StartsWith("/signalr"))
            {
                var qsAuthToken = context.HttpContext.Request.Query["enc_auth_token"].FirstOrDefault();
                if (!string.IsNullOrEmpty(qsAuthToken))
                {
                    context.Token = SimpleStringCipher.Instance.Decrypt(qsAuthToken);
                    return Task.CompletedTask;
                }
            }

            // All other clients: read the HttpOnly cookie set by the Authenticate endpoint.
            var cookieToken = context.HttpContext.Request.Cookies["access_token"];
            if (!string.IsNullOrEmpty(cookieToken))
            {
                context.Token = cookieToken;
            }

            return Task.CompletedTask;
        }
    }
}
