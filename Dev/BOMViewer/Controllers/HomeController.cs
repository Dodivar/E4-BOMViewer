using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Security.Principal;
using System.Web;
using System.Web.Configuration;
using System.Web.Helpers;
using System.Web.Mvc;
using System.Web.Security;
using BOMViewer.Controllers.api;
using BOMViewer.Models;

namespace BOMViewer.Controllers
{
    public class HomeController : Controller
    {
        //UserAPIController userAPI = new UserAPIController();       

        [AllowAnonymous]
        public ActionResult Index()
        {            
            return View();
        }

        public ActionResult Error()
        {
            return View("Shared/Error");
        }


        /*
        protected override void OnActionExecuting (ActionExecutingContext ctx) 
        {
            string adLogin = System.Web.HttpContext.Current.User.Identity.Name.ToString();
            ViewBag.isAuth = userAPI.GetTAB_Users(adLogin);

            if (!ViewBag.isAuth)
            {
                int id_User = userAPI.PostTAB_Users("", "", adLogin);                
            }
        }
        */

    }
}