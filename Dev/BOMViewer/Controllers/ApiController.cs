﻿using BOMViewer.Models;
using IBM.Data.DB2.iSeries;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Configuration;
using System.Web.Helpers;
using System.Web.Mvc;
using System.Web.Routing;
using System.Web.Script.Serialization;

namespace BOMViewer.Controllers
{
    public class AllApiController : Controller
    {
        //PROD
        //private readonly string SqlCnxStr = WebConfigurationManager.ConnectionStrings["Pro-Cfg-SqlCnxStr"].ToString();

        //LOCAL
        private readonly string SqlCnxStr = WebConfigurationManager.ConnectionStrings["SQLExpress-SqlCnxStr"].ToString();

        //AS400
        private readonly string AS400CnxStr = WebConfigurationManager.ConnectionStrings["AS400CnxStr"].ToString();


        private DB_BOM_VIEWER_Entities db = new DB_BOM_VIEWER_Entities();

        [HttpGet]        
        public IQueryable<TAB_Views> GetTAB_Views()
        {
            return db.TAB_Views;
        }

        [HttpGet]
        public List<TAB_Views> Get()
        {
            DB_BOM_VIEWER_Entities db = new DB_BOM_VIEWER_Entities();            
            return db.TAB_Views.ToList();
        }




        // GET: Api/...
        [HttpGet] // Return all line number from order
        public string GetNumberOrderLineFromOrder(int orderNumber, string orderAgence, string systemName)
        {
            SQLServerManager sql = new SQLServerManager(SqlCnxStr);
            string result = sql.SP_GetNumberOrderLineFromOrder(SqlCnxStr, orderNumber, orderAgence, systemName);

            return result;
        }
        
        [HttpGet] // Copy the order in DB_BOM_VIEWER from AS400
        public long ImportOrderFromAS400(Search recherche)
        {
            SQLServerManager sql = new SQLServerManager(SqlCnxStr);    
            long result = sql.SP_ImportOrderFromAS400(SqlCnxStr, recherche.agency, recherche.orderNumber, "MURPHY_CT", recherche.library.ToUpper());        
            
            return result;
        }

        [HttpGet] // Copy the order in DB_BOM_VIEWER from AS400
        public long ImportOrderLineFromAS400(Search recherche, int? idOrder)
        {
            SQLServerManager sql = new SQLServerManager(SqlCnxStr);
            long result = sql.SP_ImportOrderLineFromAS400(SqlCnxStr, recherche.agency, recherche.orderNumber, "MURPHY_CT", recherche.library.ToUpper(), recherche.line, idOrder);

            return result;
        }

        [HttpGet] // Return the BOM of the order
        public string GetNomenclatureLines (long idOrder)
        {           
            SQLServerManager SQL = new SQLServerManager(SqlCnxStr);
            string jsonOrder = SQL.SP_GetOrderComponents(SqlCnxStr, idOrder);

            return jsonOrder;
        }

        [HttpGet] // Return the BOM of the order
        public bool SetOrderIsComplete(int idOrder)
        {
            SQLServerManager SQL = new SQLServerManager(SqlCnxStr);
            bool res = SQL.SP_SetOrderIsComplete(SqlCnxStr, idOrder);

            return res;
        }

        [HttpGet] // To load the list options of the table targeted
        public string getListOfTypeLine(string systemName, string libraryName, string tableName, int ID_SubLevel, int ID_View, int DetailLevel)
        {
            SQLServerManager SQL = new SQLServerManager(SqlCnxStr);
            string list = SQL.SP_GetListOfTypeLine(SqlCnxStr, systemName, libraryName, tableName, ID_SubLevel, ID_View, DetailLevel);

            return list;
        }

        [HttpGet] // Return the list of table 
        public string getTableList()
        {            
            SQLServerManager SQL = new SQLServerManager(SqlCnxStr);
            string list = SQL.SP_GetTableList(SqlCnxStr);

            return list;
        }

        [HttpGet] // To get the different type of line in the table
        public string GetTypeLineOfTable(string tableName)
        {
            SQLServerManager SQL = new SQLServerManager(SqlCnxStr);
            string primaryList = SQL.SP_GetTypeLineOfTable(SqlCnxStr, tableName);

            return primaryList;
        }
        
        [HttpGet] // Return the list of the table (that is accessible by the user)
        public string GetViewList(int ID_User)
        {
            SQLServerManager SQL = new SQLServerManager(SqlCnxStr);
            string primaryList = SQL.SP_GetViewList(SqlCnxStr, ID_User);

            return primaryList;            
        }

        [HttpGet] //To take preference of the view with the Sub Level specified
        public string GetPreferenceColumnOfView(int idView, int idSubLevel)
        {
            SQLServerManager SQL = new SQLServerManager(SqlCnxStr);
            string preferenceOfView = SQL.SP_GetPreferenceColumnOfView(SqlCnxStr, idView, idSubLevel);

            return preferenceOfView;
        }

        [HttpGet] //To take all preference of the view
        public string GetPreferenceColumnOfViewAll(int idView)
        {
            SQLServerManager SQL = new SQLServerManager(SqlCnxStr);
            string preferenceOfView = SQL.SP_GetPreferenceColumnOfViewAll(SqlCnxStr, idView);

            return preferenceOfView;
        }

        [HttpGet] // To update options of a selected SubLevel of view
        public bool UpdatePreferenceColumnOfView(int idView, int idSubLevel, string[] primaryList, string[] secondaryList)
        {
            SQLServerManager SQL = new SQLServerManager(SqlCnxStr);
            string primaryListStr = "";
            string secondaryListStr = "";

            if (primaryList != null)
            {
                foreach (string ele in primaryList)
                {
                    primaryListStr += ele + ", ";
                }
            }

            if (secondaryList != null) 
            {
                    foreach (string ele in secondaryList)
                    {
                    secondaryListStr += ele + ", ";
                    }
            }

            return SQL.SP_UpdatePreferenceColumnOfView(SqlCnxStr, idView, idSubLevel, primaryListStr, secondaryListStr);
        }

        [HttpPost]// To update options of all the view
        public bool UpdatePreferenceColumnOfViewAll(int idView, string[] primaryList, string[] secondaryLsit)
        {
            SQLServerManager SQL = new SQLServerManager(SqlCnxStr);
            string primaryListStr = "";
            string secondaryListStr = "";

            if (primaryList != null)
            {
                foreach (string ele in primaryList)
                {
                    primaryListStr += ele + ", ";
                }

                primaryListStr.Remove(primaryListStr.Length - 2, 2);
            }

            if (secondaryLsit != null)
            {
                foreach (string ele in secondaryLsit)
                {
                    secondaryListStr += ele + ", ";
                }

                secondaryListStr.Remove(secondaryListStr.Length - 2, 2);
            }

            return SQL.SP_UpdatePreferenceColumnOfViewAll(SqlCnxStr, idView, primaryListStr, secondaryListStr);
        }


        [HttpGet]// Return all the Sub levels of all table
        public bool UpdateLastViewUsed(int ID_User, int ID_View)
        {
            SQLServerManager SQL = new SQLServerManager(SqlCnxStr);
            bool result = SQL.SP_UpdateLastViewUsed(SqlCnxStr, ID_User, ID_View);

            return result;
        }


        [HttpGet]// Return all the Sub levels of all table
        public string GetPreferenceLineOfView(int ID_View)
        {
            SQLServerManager SQL = new SQLServerManager(SqlCnxStr);
            string lineList = SQL.SP_GetPreferenceLineOfView(SqlCnxStr, ID_View);

            return lineList;
        }



        [HttpGet]// Return all the Sub levels of all table
        public bool UpdatePreferenceLineOfView(int ID_View, string ListLine)
        {
            SQLServerManager SQL = new SQLServerManager(SqlCnxStr);
            bool res = SQL.SP_UpdatePreferenceLineOfView(SqlCnxStr, ID_View, ListLine);

            return res;
        }

        [HttpGet]// Return all the Sub levels of all table
        public string GetTableSubLevels()
        {
            SQLServerManager SQL = new SQLServerManager(SqlCnxStr);
            string lineList = SQL.SP_GetTableSubLevels(SqlCnxStr);

            return lineList;
        }


        [HttpGet]// Load every data of the order specified with the configuration of the current view
        public string GetCustomJsonOrder(int ID_Order, int ID_View)
        {
            SQLServerManager SQL = new SQLServerManager(SqlCnxStr);
            string JsonTreeview = SQL.SP_GetCustomJsonOrder(SqlCnxStr, ID_Order, ID_View);

            return JsonTreeview;
        }


        [HttpGet]// Load order + line order data of the order specified with the configuration of the current view
        public string GetCustomJsonOrderFirstLine(int ID_Order, int ID_View, string OrderLine)
        {
            SQLServerManager SQL = new SQLServerManager(SqlCnxStr);
            string JsonTreeview = SQL.SP_GetCustomJsonOrderFirstLine(SqlCnxStr, ID_Order, ID_View, OrderLine);

            return JsonTreeview;
        }


        [HttpGet]// Load chhid line data of the line number specified with the configuration of the current view
        public string GetCustomJsonLine(int ID_View, string TableName, int IdDataSource, int idTreeview)
        {
            SQLServerManager SQL = new SQLServerManager(SqlCnxStr);
            string JsonTreeview = SQL.SP_GetCustomJsonLine(SqlCnxStr, ID_View, TableName, IdDataSource, idTreeview);

            return JsonTreeview;
        }

        [HttpGet]// Load chhid line data of the line number specified with the configuration of the current view
        public string GetCustomJsonAllLine(int ID_View, string TableName, int IdDataSource, int idTreeview, int tvLength)
        {
            SQLServerManager SQL = new SQLServerManager(SqlCnxStr);
            string JsonTreeview = SQL.SP_GetCustomJsonAllLine(SqlCnxStr, ID_View, TableName, IdDataSource, idTreeview, tvLength);

            return JsonTreeview;
        }

        [HttpGet]// Load every data of the version of the order specified with the configuration of the current view
        public string getOrderVersion(int idOrder, int idVersion, int idView)
        {
            SQLServerManager SQL = new SQLServerManager(SqlCnxStr);
            string JsonTreeview = SQL.SP_GetCustomJsonOrderVersion(SqlCnxStr, idOrder, idVersion, idView);

            return JsonTreeview;
        }


        [HttpGet]// Retourne le nombre de version trouvé pour la commande
        public string GetNumberOrderVersion(string OrderAgence, int OrderNumber)
        {
            SQLServerManager SQL = new SQLServerManager(SqlCnxStr);
            string numberOrderVersion = SQL.SP_GetNumberOrderVersion(SqlCnxStr, OrderAgence, OrderNumber);

            return numberOrderVersion;
        }


        [HttpGet]// Load every data of the version of the order version specified
        public int GetSpecifiedOrderVersion(string orderAgence, int orderNumber, int orderVersion, int ID_View)
        {
            SQLServerManager SQL = new SQLServerManager(SqlCnxStr);
            int idOrder = SQL.SP_GetSpecifiedOrderVersion(SqlCnxStr, orderAgence, orderNumber, orderVersion, ID_View);

            return idOrder;
        }


        

        [HttpGet]// Return color choosen by user by type of line in JSON text
        public string GetUserColorSetting(int ID_User)
        {
            SQLServerManager SQL = new SQLServerManager(SqlCnxStr);
            string result = SQL.SP_GetUserColorSetting(SqlCnxStr, ID_User);

            return result;
        }


        [HttpGet]// Return color choosen by user by type of line in JSON text
        public string UpdateUserColorSetting(int ID_User, string ColorValueList)
        {            
            SQLServerManager SQL = new SQLServerManager(SqlCnxStr);
            string result = SQL.SP_UpdateUserColorSetting(SqlCnxStr, ID_User, ColorValueList);

            return result;
        }


        [HttpGet]// Return detail line text with all field of the table
        public string GetDetailLineData (int ID_View, string TableSubLevelType, string TableName, string JsonField)
        {            
            SQLServerManager SQL = new SQLServerManager(SqlCnxStr);
            string result = SQL.SP_GetDetailLineData(SqlCnxStr, ID_View, TableSubLevelType, TableName, JsonField);

            return result;
        }


        [HttpGet]// Return TOP 10 of the most imported order
        public string GetTop10ImportedOrder()
        {
            SQLServerManager SQL = new SQLServerManager(SqlCnxStr);
            string result = SQL.SP_GetTop10ImportedOrder(SqlCnxStr);

            return result;
        }


        [HttpGet]// Return last view used by the user
        public string GetLastViewUsed(int ID_User)
        {
            SQLServerManager SQL = new SQLServerManager(SqlCnxStr);
            string result = SQL.SP_GetLastViewUsed(SqlCnxStr, ID_User);

            return result;
        }

        [HttpGet]// Return color choosen by user by type of line in JSON text
        public string GetSettingDisplayDeletedLine(int ID_User)
        {
            SQLServerManager SQL = new SQLServerManager(SqlCnxStr);
            string result = SQL.SP_GetSettingDisplayDeletedLine(SqlCnxStr, ID_User);

            return result;
        }


        [HttpGet]// Return color choosen by user by type of line in JSON text
        public void UpdateSettingDisplayDeletedLine(int ID_User, int value)
        {
            SQLServerManager SQL = new SQLServerManager(SqlCnxStr);
            SQL.SP_UpdateSettingDisplayDeletedLine(SqlCnxStr, ID_User, value);
        }

        [HttpGet]// Return color choosen by user by type of line in JSON text
        public void UpdateLastOrderDisplayed(int ID_User, int orderNumber, string agency, string line)
        {
            SQLServerManager SQL = new SQLServerManager(SqlCnxStr);
            SQL.SP_UpdateLastOrderDisplayed(SqlCnxStr, ID_User, orderNumber, agency, line);
        }
 

        [HttpGet]// Return color choosen by user by type of line in JSON text
        public string GetLastOrderDisplayed(int ID_User)
        {
            SQLServerManager SQL = new SQLServerManager(SqlCnxStr);
            string result = SQL.SP_GetLastOrderDisplayed(SqlCnxStr, ID_User);
            return result;
        }        
    }
}