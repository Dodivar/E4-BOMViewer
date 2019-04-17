using System.Web;
using System.Web.Optimization;

namespace BOMViewer
{
    public class BundleConfig
    {
        // Pour plus d'informations sur le regroupement, visitez https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-3.3.1.min.js",
                        "~/Scripts/jquery.validate*"));
            

            // Utilisez la version de développement de Modernizr pour le développement et l'apprentissage. Puis, une fois
            // prêt pour la production, utilisez l'outil de génération à l'adresse https://modernizr.com pour sélectionner uniquement les tests dont vous avez besoin.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            
            // Ajout des fichiers Angular
            bundles.Add(new ScriptBundle("~/bundles/angular").Include(
                    "~/Scripts/angular.min.js",
                    "~/Scripts/angular-resource.min.js",
                    "~/Scripts/angular-route.min.js",
                    "~/Scripts/ngStorage.min.js"));

                                // DEVEXRPRESS \\
            // For DevExpress dependencies script
            bundles.Add(new ScriptBundle("~/bundles/scriptDevExpress")
                    .Include("~/SG/scripts/Vendor/dx-all.js"));            


                                // SG \\
            // Ajout des Controlleur
            bundles.Add(new ScriptBundle("~/bundles/angularController")
                    .IncludeDirectory("~/ControllerJs/", "*.js", true));

            // Ajout des styles perso
            bundles.Add(new StyleBundle("~/bundles/cssSG")
                    .IncludeDirectory("~/SG/styles/App/", "*.css", true));

            // Ajout des scripts perso
            bundles.Add(new ScriptBundle("~/bundles/jsSG")
                    .IncludeDirectory("~/SG/scripts/App/", "*.js", true));

            // Ajout des scripts de données pour les widgets
            bundles.Add(new ScriptBundle("~/bundles/itemsJs")
                    .IncludeDirectory("~/Content/items/", "*.js", true));


            /*
            // Ajout des scripts perso 
            bundles.Add(new ScriptBundle("~/bundles/BOMViewerDirectives")
                    .IncludeDirectory("~/Directives/", "*.js", true)); // Factory + Service
            */



#if DEBUG
            BundleTable.EnableOptimizations = false;
#else
            BundleTable.EnableOptimizations = true; // Useful for deploy on IIS server
#endif
        }
    }
}
