using Igprog;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web.Services;

/// <summary>
/// Settings
/// </summary>
[WebService(Namespace = "http://studiotanya.hr/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
[System.Web.Script.Services.ScriptService]
public class Settings : WebService {
    public Settings()
    {
    }

    #region Class
    public class NewSettings {
        public string company;
        public string address;
        public string pin; // ***** OIB *****//
        public string phone;
        public string email;
        public string companyEmail;
        public List<WorkingTime> workingTime;
        public Follow follow;
    }

    public class WorkingTime {
        public string days;
        public string time;
    }

    public class Follow {
        public string facebook;
        public string instagram;
    }
    #endregion Class

    #region WebMethods
    [WebMethod]
    public string Init() {
        NewSettings x = new NewSettings();
        x.follow = new Follow();
        return JsonConvert.SerializeObject(x, Formatting.None);
    }

    [WebMethod]
    public string Load() {
        NewSettings x = new NewSettings();
        try {
            string filePath = "~/data/json/settings.json";
            if (!File.Exists(Server.MapPath(filePath))) {
                return JsonConvert.SerializeObject(x, Formatting.None);
            }
            string json =  File.ReadAllText(Server.MapPath(filePath));
            return JsonConvert.SerializeObject(JsonConvert.DeserializeObject<NewSettings>(json), Formatting.None);
        } catch (Exception e) {
            return JsonConvert.SerializeObject(x, Formatting.None);
        }
    }

    [WebMethod]
    public string Save(NewSettings settings) {
        Global.Response response = new Global.Response();
        try {
            string path = "~/data/json";
            string filepath = path + "/settings.json";
            CreateFolder(path);
            WriteFile(filepath, JsonConvert.SerializeObject(settings, Formatting.None));
            response.isSuccess = true;
            response.msg = "Spremljeno";
            return JsonConvert.SerializeObject(response, Formatting.None);
        } catch (Exception e) {
            response.isSuccess = false;
            response.msg = e.Message;
            return JsonConvert.SerializeObject(response, Formatting.None);
        }
    }
    #endregion WebMethods

    #region Methods
    protected void CreateFolder(string path) {
        if (!Directory.Exists(Server.MapPath(path))) {
            Directory.CreateDirectory(Server.MapPath(path));
        }
    }

    protected void WriteFile(string path, string value) {
        File.WriteAllText(Server.MapPath(path), value);
    }
    #endregion Methods

}
