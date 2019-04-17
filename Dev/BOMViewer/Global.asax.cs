using BOMViewer.App_Start;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;


namespace BOMViewer
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            GlobalConfiguration.Configure(WebApiConfig.Register);
            AreaRegistration.RegisterAllAreas();
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);


            // Commented because we return model and not table from entities
            // ignore the reference pointing back to the object            
            /*HttpConfiguration config = GlobalConfiguration.Configuration;
            config.Formatters.JsonFormatter
                        .SerializerSettings
                        .ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;*/
        }

        /*
        protected void Application_AuthenticateRequest(object sender, EventArgs e)
        {
            if (System.Threading.Thread.CurrentPrincipal.Identity.IsAuthenticated)
            {
                string adLogin = System.Threading.Thread.CurrentPrincipal.Identity.Name.ToString();
                string tst = System.Threading.Thread.CurrentPrincipal.Identity.AuthenticationType;

                WindowsIdentity wi = (WindowsIdentity)HttpContext.Current.User.Identity;
                //CustomMembershipPrincipal mp = new CustomMembershipPrincipal(wi);
                //HttpContext.Current.User = mp;
            }
        }
        */


    }
}
