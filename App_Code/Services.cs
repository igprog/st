using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using System.Web.Services;
using System.IO;

/// <summary>
/// Services
/// </summary>
[WebService(Namespace = "http://studiotanya.hr/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
[System.Web.Script.Services.ScriptService]
public class Services : WebService {

    public Services() {
    }

    public class NewService {
        public string id;
        public string title;
        public string price;
        public string currency;
    }

    public class ServiceGroup {
        public string serviceGroup;
        public List<NewService> services;
    }

    public class Response {
        public bool isSuccess;
        public string msg;
    }

    [WebMethod]
    public string InitService() {
        NewService x = new NewService();
        return JsonConvert.SerializeObject(x, Formatting.None);
    }

    [WebMethod]
    public string InitServiceGroup() {
        return JsonConvert.SerializeObject(_InitServiceGroup(), Formatting.None);
    }

    [WebMethod]
    public string Load() {
        List<ServiceGroup> xx = new List<ServiceGroup>();
        xx.Add(_InitServiceGroup());
        try {
            string filePath = "~/data/json/services.json";
            if (!File.Exists(Server.MapPath(filePath))) {
                return JsonConvert.SerializeObject(xx, Formatting.None);
            }
            string json = File.ReadAllText(Server.MapPath(filePath));
            return json;
        } catch (Exception e) {
            return JsonConvert.SerializeObject(xx, Formatting.None);
        }
    }

    [WebMethod]
    public string Save(List<ServiceGroup> services) {
        Response response = new Response();
        try {
            string path = "~/data/json";
            string filePath = string.Format("{0}/services.json", path);
            string json = JsonConvert.SerializeObject(services, Formatting.None);
            CreateFolder(path);
            WriteFile(filePath, json);
            response.isSuccess = true;
            response.msg = "ok";
            return JsonConvert.SerializeObject(response, Formatting.None);
        } catch (Exception e) {
            response.isSuccess = false;
            response.msg = e.Message;
            return JsonConvert.SerializeObject(response, Formatting.None);
        }
    }

    private ServiceGroup _InitServiceGroup() {
        ServiceGroup x = new ServiceGroup();
        x.services = new List<NewService>();
        x.services.Add(new NewService());
        return x;
    }

    protected void CreateFolder(string path) {
        if (!Directory.Exists(Server.MapPath(path))) {
            Directory.CreateDirectory(Server.MapPath(path));
        }
    }

    protected void WriteFile(string path, string value) {
        File.WriteAllText(Server.MapPath(path), value);
    }


}
