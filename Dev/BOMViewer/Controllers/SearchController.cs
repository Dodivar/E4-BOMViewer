using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Configuration;
using System.Web.Helpers;
using System.Web.Mvc;
using BOMViewer.Models;

namespace BOMViewer.Controllers
{
    [Authorize]
    public class SearchController : Controller
    {               
        public ActionResult Index()
        {
            return PartialView("_Recherche");
        }

        public ActionResult Recherche()
        {           
            return PartialView("_Recherche");
        }

        public ActionResult Treeview()
        {
            return View("_Afficher");
        }


    }
}