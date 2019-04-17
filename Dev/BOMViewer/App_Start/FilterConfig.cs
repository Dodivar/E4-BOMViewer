using System.Web;
using System.Web.Mvc;

namespace BOMViewer
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());

            // Autorise les attribut d'autorisation d'accès
            filters.Add(new AuthorizeAttribute());
        }
    }
}
