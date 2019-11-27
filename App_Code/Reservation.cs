using System.Web.Services;
using Newtonsoft.Json;
using Igprog;

/// <summary>
/// Reservation
/// </summary>
[WebService(Namespace = "http://studiotanya.hr/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
[System.Web.Script.Services.ScriptService]
public class Reservation : System.Web.Services.WebService {
    Global G = new Global();

    public Reservation() {
    }

    public class NewReservation {
        public string service;
        public string date;
        public string time;
        public string name;
        public string phone;
        public Mail.Response response;
    }

    [WebMethod]
    public string Init() {
        NewReservation x = new NewReservation();
        x.service = null;
        x.date = null;
        x.time = null;
        x.name = null;
        x.phone = null;
        x.response = new Mail.Response();
        x.response.isSent = false;
        x.response.msg = null;
        return JsonConvert.SerializeObject(x, Formatting.None);
    }

    [WebMethod]
    public string Send(NewReservation x) {
        string subject = string.Format(@"
<p>Usluga: {0}</p>
<p>Datum: {1}</p>
<p>Vrijeme: {2}</p>
<p>Ime: {3}</p>
<p>Telefon: <a href=""tel:{4}"" style=""color:#ff6b6b"">&#9742; {4}</a></p>", x.service, x.date, x.time, x.name, x.phone);
        Mail m = new Mail();
        x.response = m.SendMail(G.email, "Novi upit", subject);
        return JsonConvert.SerializeObject(x, Formatting.None);
    }

}
