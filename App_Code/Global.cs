using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.IO;
using System.Configuration;
using Igprog;

/// <summary>
/// Global
/// </summary>
namespace Igprog {
    public class Global {
        public Global() {
        }

        public string myEmail = ConfigurationManager.AppSettings["myEmail"];
        public string myEmailName = ConfigurationManager.AppSettings["myEmailName"];
        public string myPassword = ConfigurationManager.AppSettings["myPassword"];
        public int myServerPort = Convert.ToInt32(ConfigurationManager.AppSettings["myServerPort"]);
        public string myServerHost = ConfigurationManager.AppSettings["myServerHost"];


    }
}