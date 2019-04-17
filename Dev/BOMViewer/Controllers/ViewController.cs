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
    public class ViewController : Controller
    {
        ViewModel view = new ViewModel();

        public ActionResult Index()
        {            
            return View();
        }

        public ActionResult Custom()
        {
            return PartialView("_Custom");
        }
    }
}