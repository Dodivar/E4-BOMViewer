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
using System.Web.Http;
using System.Web.Http.Description;
using BOMViewer.Models;

namespace BOMViewer.Controllers.api
{
    [System.Web.Http.RoutePrefix("api/Users")]
    public class UserAPIController : ApiController
    {
        ConnectionStringSettings cnx_sg = ConfigurationManager.ConnectionStrings["DB_BOM_VIEWER_Entities"];
        ConnectionStringSettings cnx_local = ConfigurationManager.ConnectionStrings["DB_BOM_VIEWEREntities"];

        //local
        private DB_BOM_VIEWEREntities db = new DB_BOM_VIEWEREntities();

        //sg
        //private DB_BOM_VIEWER_Entities db = new DB_BOM_VIEWER_Entities();

        // GET: api/UserAPI
        [System.Web.Http.Route("GetUsers")]
        public List<UserModel> GetTAB_Users()
        {
            var users = db.TAB_Users.ToList();
            var reponse = new List<UserModel>();

            foreach (var u in users)
            {
                reponse.Add(new UserModel()
                {
                    ID_User = u.ID_User,
                    UserFirstname = u.UserFirstname,
                    UserSurname = u.UserSurname,
                    UserLogin = u.UserLogin,
                    CreationDate = u.CreationDate
                });
            }
            return reponse;
        }

        // GET: api/UserAPI/5
        [System.Web.Http.Route("GetUser")]
        public async Task<IHttpActionResult> GetTAB_Users(int id)
        {
            TAB_Users u = await db.TAB_Users.FindAsync(id);
            if (u == null)
            {
                return NotFound();
            }

            var reponse = new UserModel();
            reponse.ID_User = u.ID_User;
            reponse.UserFirstname = u.UserFirstname;
            reponse.UserSurname = u.UserSurname;
            reponse.UserLogin = u.UserLogin;
            reponse.CreationDate = u.CreationDate;

            return Ok(reponse);
        }

        // GET: api/UserAPI/SALM_L1\DILLENSEGERD
        [System.Web.Http.Route("RegisterUser")]
        public bool GetTAB_Users(string login)
        {
            if (db.TAB_Users.Where(u => u.UserLogin == login).Count() == 0)
            {
                return false;
            }
            return true;
        }

        // PUT: api/UserAPI/5
        [HttpPut]
        [System.Web.Http.Route("ModifyUser")]
        [ResponseType(typeof(UserModel))]
        public async Task<IHttpActionResult> PutTAB_Users(int id, string firstName, string surName)
        {
            /*

            if (id != tAB_Users.ID_User)
            {
                return BadRequest();
            }*/

            TAB_Users u = await db.TAB_Users.FindAsync(id);
            if (u == null)
                return NotFound();

            u.UserFirstname = firstName;
            u.UserSurname = surName;

            db.Entry(u).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TAB_UsersExists(id))
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

        // POST: api/UserAPI
        [HttpPost]
        [System.Web.Http.Route("AddUser")]
        [ResponseType(typeof(UserModel))]
        public int PostTAB_Users(string firstName, string surName, string login)
        {
            
            var users = db.TAB_Users.Where(u => u.UserLogin == login).ToList();
            if (users.Count() > 0)
                return 0;

            TAB_Users user = new TAB_Users()
            {
                UserFirstname = firstName,
                UserSurname = surName,
                UserLogin = login,
                CreationDate = DateTime.Now
            };

            int res = db.TAB_Users.Add(user).ID_User;

            db.SaveChangesAsync();

            //return CreatedAtRoute("DefaultApi", new { id = tAB_Users.ID_User }, tAB_Users);
            return res;
        }

        // DELETE: api/UserAPI/5
        [System.Web.Http.Route("DeleteUser")]
        [ResponseType(typeof(UserModel))]
        public async Task<IHttpActionResult> DeleteTAB_Users(int id)
        {
            
            TAB_Users tAB_Users = await db.TAB_Users.FindAsync(id);
            if (tAB_Users == null)
            {
                return NotFound();
            }

            db.TAB_Users.Remove(tAB_Users);

            UserModel user = new UserModel();
            user.ID_User = user.ID_User;
            user.UserFirstname = user.UserFirstname;
            user.UserSurname = user.UserSurname;
            user.UserLogin = user.UserLogin;
            user.CreationDate = user.CreationDate;

            await db.SaveChangesAsync();
            return Ok(tAB_Users);
        }


        //  STORED PROCEDURE  \\ 



        protected override void Dispose(bool disposing)
        {

            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool TAB_UsersExists(int id)
        {

            return db.TAB_Users.Count(e => e.ID_User == id) > 0;
        }
    }
}