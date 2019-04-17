using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Configuration;
using System.Web.Http;
using System.Web.Http.Description;
using System.Web.Mvc;
using BOMViewer.Models;

namespace BOMViewer.Controllers
{
    [System.Web.Http.RoutePrefix("api/Views")]
    public class ViewAPIController : ApiController
    {                
        ConnectionStringSettings cnx_sg = ConfigurationManager.ConnectionStrings["DB_BOM_VIEWER_Entities"];
        ConnectionStringSettings cnx_local = ConfigurationManager.ConnectionStrings["DB_BOM_VIEWEREntities"];

        //local
        private DB_BOM_VIEWEREntities db = new DB_BOM_VIEWEREntities();

        //sg
        //private DB_BOM_VIEWER_Entities db = new DB_BOM_VIEWER_Entities();        

        // Return a specific view
        // GET: api/ViewsAPI/5        
        [System.Web.Http.Route("GetView")]
        [ResponseType(typeof(ViewModel))]
        public async Task<IHttpActionResult> GetOneTAB_Views(int id)
        {            
            TAB_Views v = await db.TAB_Views.FindAsync(id);
            if (v == null)
            {
                return NotFound();
            }

            var reponse = new ViewModel();
            reponse.ID_View = v.ID_View;
            reponse.ID_User = v.ID_User.GetValueOrDefault();
            reponse.ViewName = v.ViewName;
            reponse.ViewDesc = v.ViewDesc;
            reponse.CreationDate = v.CreationDate;

            return Ok(reponse);
        }

        // Return views created by user and Team view
        // GET: api/Views
        [System.Web.Http.Route("GetViews")]
        public List<ViewModel> GetTAB_Views(int id_User)
        {
            var views = db.TAB_Views.Where(v => v.ID_User == id_User || v.ID_User == null).ToList();
            var reponse = new List<ViewModel>();

            foreach (var v in views)
            {
                reponse.Add(new ViewModel()
                {
                    ID_View = v.ID_View,
                    ID_User = v.ID_User.GetValueOrDefault(),
                    ViewName = v.ViewName,
                    ViewDesc = v.ViewDesc,
                    CreationDate = v.CreationDate
                });
            }
            return reponse;
        }

        // GET: Return view created by user    
        [System.Web.Http.Route("GetUserViews")]
        public List<ViewModel> GetUserTAB_Views(int id_User)
        {
            var views = db.TAB_Views.Where(v => v.ID_User == id_User).ToList();
            var reponse = new List<ViewModel>();

            foreach (var v in views)
            {
                reponse.Add(new ViewModel()
                {
                    ID_View = v.ID_View,
                    ID_User = v.ID_User.GetValueOrDefault(),
                    ViewName = v.ViewName,
                    ViewDesc = v.ViewDesc,
                    CreationDate = v.CreationDate
                });
            }
            return reponse;
        }

        // PUT: api/ViewsAPI/5
        [System.Web.Http.Route("ModifyView")]
        public async Task<IHttpActionResult> PutTAB_Views(int id, ViewModel view)
        {
       /*
            if (id != view.ID_View)
            {
                return BadRequest();
            }
            */

            TAB_Views v = await db.TAB_Views.FindAsync(id);

            if (v == null)
                return NotFound();

            v.ViewName = view.ViewName;
            v.ViewDesc = view.ViewDesc;            

            db.Entry(v).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TAB_ViewsExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/ViewsAPI        
        [System.Web.Http.HttpPost]
        [System.Web.Http.Route("PostView")]
        [ResponseType(typeof(ViewModel))]
        public async Task<IHttpActionResult> PostTAB_Views(ViewModel view)
        {
            /* USELESS IF WE DON'T USE TAB_Views from params
             * if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }*/

            var views = db.TAB_Views.Where(v => (v.ID_User == view.ID_User || v.ID_User == null) && v.ViewName == view.ViewName).ToList();
            if (views.Count() > 0)
                return BadRequest();

            db.TAB_Views.Add(new TAB_Views(){                
                ID_User = view.ID_User,
                ViewName = view.ViewName,
                ViewDesc = view.ViewDesc,
                CreationDate = DateTime.Now
            });
            await db.SaveChangesAsync();

            //return CreatedAtRoute("DefaultApi", new { id = view.ID_View }, view);
            return Ok(view);
        }

        // DELETE: api/ViewsAPI/5
        [ResponseType(typeof(ViewModel))]
        [System.Web.Http.Route("DeleteView")]
        public async Task<IHttpActionResult> DeleteTAB_Views(int id)
        {
          

            TAB_Views tAB_Views = await db.TAB_Views.FindAsync(id);
            if (tAB_Views == null)
            {
                return NotFound();
            }
            
            db.TAB_Views.Remove(tAB_Views);

            ViewModel view = new ViewModel();
            view.ID_View = tAB_Views.ID_View;
            view.ID_User = tAB_Views.ID_User.GetValueOrDefault();
            view.ViewName = tAB_Views.ViewName;
            view.ViewDesc = tAB_Views.ViewDesc;

            await db.SaveChangesAsync();
            return Ok(view);
        }

        // STORED PROCEDURE \\

        [System.Web.Http.HttpPost]
        [System.Web.Http.Route("CreateView")]
        public int CreateView(int id_User, string name, string desc)
        {           
            return db.SP_CreateView(id_User, name, desc);
        }


        [System.Web.Http.HttpDelete]
        [System.Web.Http.Route("DeleteView")]
        public int DeleteView(int id_User, int id_View)
        {
            return db.SP_DeleteView(id_User, id_View);
        }

        [System.Web.Http.HttpGet]
        [System.Web.Http.Route("GetPreferenceLineOfView")]
        public IEnumerable<SP_GetPreferenceLineOfView_Result> GetPreferenceLineOfView (int id_View)
        {
            return db.SP_GetPreferenceLineOfView(id_View).AsEnumerable();
        }

        [System.Web.Http.HttpPost]
        [System.Web.Http.Route("UpdatePreferenceLineOfView")]
        public int GetPreferenceColumnOfView([FromUri]int id_View, [FromUri]string listLine)
        {
           
            return db.SP_UpdatePreferenceLineOfView(id_View, listLine);
        }

        [System.Web.Http.HttpGet]
        [System.Web.Http.Route("GetPreferenceColumnOfViewAll")]
        public IEnumerable<SP_GetPreferenceColumnOfViewAll_Result> GetPreferenceColumnOfViewAll(int id_View)
        {
          
            return db.SP_GetPreferenceColumnOfViewAll(id_View).AsEnumerable();
        }

        [System.Web.Http.HttpGet]
        [System.Web.Http.Route("GetPreferenceColumnOfView")]
        public IEnumerable<SP_GetPreferenceColumnOfView_Result> GetPreferenceColumnOfView(int id_View, int idSubLevel)
        {
          
            return db.SP_GetPreferenceColumnOfView(id_View, idSubLevel).AsEnumerable();
        }




        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool TAB_ViewsExists(int id)
        {
            return db.TAB_Views.Count(e => e.ID_View == id) > 0;
        }
    }
}