using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Configuration;
using System.Web.Helpers;
using System.Web.Mvc;
using BOMViewer.Models;

namespace BOMViewer.Controllers
{
    public class UserSettingController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }        
    }
}