using System.Web;
using System.Web.Optimization;

namespace TerrainGenerator.WebClient
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            //bundles.Add(new StyleBundle("~/bundles/css").IncludeDirectory(
            //          "~/Content",
            //          "*.css"));
            bundles.Add(new StyleBundle("~/bundles/css").Include(
                "~/Content/Canvas.css",
                "~/Content/BasicConventions.css"));

            //bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
            //     "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                "~/Scripts/jquery-{version}.js",
                "~/Scripts/jquery.mousewheel.min.js",

                "~/Scripts/babylon.2.2.js",

                "~/Scripts/UI/CameraManager.js",
                "~/Scripts/UI/UIHtmlMethods.js",
                "~/Scripts/UI/UiManager.js",
                "~/Scripts/Localization/LocalizationManager.js",
                "~/Scripts/Localization/en-GB.js",
                "~/Scripts/Loaders/SystemLoader.js",                
                "~/Scripts/Utilities/StringHelper.js",
                "~/Scripts/Utilities/Dictionary.js",
                "~/Scripts/Utilities/forEachSupport.js",
                "~/Scripts/Account/AccountManager.js",
                "~/Scripts/HttpClients/BaseHttpClient.js",
                "~/Scripts/HttpClients/AccountHttpClient.js",
                "~/Scripts/HttpClients/SystemHttpClient.js"));

            bundles.Add(new ScriptBundle("~/bundles/app").Include(
                "~/Scripts/MapElements/MapElementType.js",

                "~/Scripts/Resources/Resource.js",
                "~/Scripts/Resources/ResourcesManager.js",

                "~/Scripts/Utilities/CountDownEvent.js",
                "~/Scripts/Utilities/CanvasExtensions.js",

                "~/Scripts/Materials/WaterMaterial.js",
                "~/Scripts/Materials/TerrainMaterial.js",

                "~/Scripts/Environment/Sky.js",
                "~/Scripts/Environment/Water.js",

                "~/Scripts/Tiles/CoordinateSystemHelps.js",                
                "~/Scripts/Tiles/Tile.js",
                "~/Scripts/Tiles/TileImage.js",
                "~/Scripts/Tiles/TilesManager.js",

                "~/Scripts/Sounds/SoundsContainer.js",                

                "~/Scripts/Models/ModelsContainerManager.js",
                "~/Scripts/Models/BaseModelsContainer.js",
                "~/Scripts/Models/MasterModelsContainer.js",
                "~/Scripts/Models/BaseModel.js",
                "~/Scripts/Models/BasicGeometryModel.js",
                "~/Scripts/Models/ComplexGeometryModel.js",
                "~/Scripts/Models/BaseInstanceModel.js",
                "~/Scripts/Models/ResourcedInstanceModel.js",
                "~/Scripts/Models/ElementedResourcedInstanceModel.js",
                "~/Scripts/Models/PositionedElementedResourcedInstanceModel.js",

                "~/Scripts/Actions/ActionsQueue.js",                

                "~/Scripts/Synchronizer/SynchronizerManager.js",

                "~/Scripts/Loaders/EngineLoader.js"));

                //"Scripts/D3Models/AnimalModelsContainer.js",                

                //"Scripts/Account/SynchronizerManager.js",
                //"Scripts/Account/ResourceManager.js",
                //"Scripts/Account/WorkersManager.js",
                //"Scripts/Account/Model/Resource.js",
                //"Scripts/Account/Model/Worker.js",
                //"Scripts/Account/Model/WorkersAllocation.js"

            //bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
            //            "~/Scripts/jquery-{version}.js"));

            //bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
            //            "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            //bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
            //            "~/Scripts/modernizr-*"));

            //bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
            //          "~/Scripts/bootstrap.js",
            //          "~/Scripts/respond.js"));

            //bundles.Add(new StyleBundle("~/Content/css").Include(
            //          "~/Content/bootstrap.css",
            //          "~/Content/site.css"));
        }
    }
}
