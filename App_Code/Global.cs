﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.IO;
using System.Configuration;
using System.Data.SQLite;
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
        public string email = ConfigurationManager.AppSettings["email"];
        public string adminUserName = ConfigurationManager.AppSettings["adminUserName"];
        public string adminPassword = ConfigurationManager.AppSettings["adminPassword"];
        public string dataBase = ConfigurationManager.AppSettings["dataBase"];

        public string ReadS(SQLiteDataReader reader, int i) {
            return reader.GetValue(i) == DBNull.Value ? null : reader.GetString(i);
        }

        public int ReadI(SQLiteDataReader reader, int i) {
            return reader.GetValue(i) == DBNull.Value ? 0 : reader.GetInt32(i);
        }

        public double ReadD(SQLiteDataReader reader, int i) {
            return reader.GetValue(i) == DBNull.Value ? 0 : Convert.ToDouble(reader.GetString(i));
        }

        public bool ReadB(SQLiteDataReader reader, int i) {
            return reader.GetValue(i) == DBNull.Value ? false : Convert.ToBoolean(reader.GetString(i));
        }

        public class Response {
            public bool isSuccess;
            public string msg;
        }
    }
}