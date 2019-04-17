using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.IO;
using System.Text.RegularExpressions;

namespace BOMViewer.Controllers
{
    public class AngularTemplatesController : Controller
    {
        [ChildActionOnly]
        public ActionResult Inline()
        {
            IEnumerable<string> templateNames = Directory
                .GetFiles(Server.MapPath("~/Views/AngularTemplates/Templates/"))
                .Select(Path.GetFileNameWithoutExtension);

            return View(templateNames);
        }

        public ActionResult Template(string name)
        {
            if (name == null || !Regex.IsMatch(name, @"^[-\w]+$"))
                throw new ArgumentException("Illegal template name", "name");

            string relativeViewPath = string.Format("~/Views/AngularTemplates/Templates/{0}.cshtml", name);

            return View(relativeViewPath);
        }
    }
}
