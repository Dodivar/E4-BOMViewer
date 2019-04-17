using BOMViewer.Controllers.api;
using BOMViewer.Models;
using System.Security.Principal;
using System.Web.Mvc;

namespace BOMViewer.Controllers
{
    public class RegistrationController : Controller
    {
        UserAPIController userAPI = new UserAPIController();
        UserModel model;        

        public ActionResult Index()
        {
            string result = "index";

            model = new UserModel();
            model.UserLogin = WindowsIdentity.GetCurrent().Name.ToString();

            ViewBag.login = model.UserLogin;       

            // Return TRUE if userLogin is known
            if (userAPI.GetTAB_Users(model.UserLogin))
                result = "~/Views/Home/index.cshtml";

            return View(result, model);
        }
    }
}