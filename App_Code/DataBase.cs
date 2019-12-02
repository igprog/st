using System;
using System.Web;
using System.Configuration;
using System.IO;
using System.Data.SQLite;
using Igprog;

/// <summary>
/// DataBase
/// </summary>
public class DataBase {
    Global G = new Global();
    public DataBase() {
    }

    public string scheduler = "scheduler";
    public string reservation = "reservation";

    public void Scheduler(string path) {
            string sql = @"CREATE TABLE IF NOT EXISTS scheduler
                (room INTEGER,
                clientId VARCHAR(50),
                content NVARCHAR(200),
                startDate INTEGER,
                endDate INTEGER,
                userId VARCHAR(50))";
            CreateTable(path, sql);
        }

        public void Reservation(string path) {
            string sql = @"CREATE TABLE IF NOT EXISTS reservation
                    (service VARCHAR(50),
                    serviceDate VARCHAR(50),
                    serviceTime NVARCHAR(50),
                    name NVARCHAR(200),
                    phone NVARCHAR(50),
                    email NVARCHAR(50),
                    confirmed NVARCHAR(50))";
            CreateTable(path, sql);
        }

    public void CreateDataBase(string userId, string table) {
            try {
                string path = GetDataBasePath(G.dataBase);
                string dir = Path.GetDirectoryName(path);
                if (!Directory.Exists(dir)) {
                    Directory.CreateDirectory(dir);
                }
                if (!File.Exists(path)) {
                    SQLiteConnection.CreateFile(path);
                }
                CreateTables(table, path);
            } catch (Exception e) { }
        }

        public void CreateGlobalDataBase(string path, string table) {
            try {
                string dir = Path.GetDirectoryName(path);
                if (!Directory.Exists(dir)) {
                    Directory.CreateDirectory(dir);
                }
                if (!File.Exists(path)) {
                    SQLiteConnection.CreateFile(path);
                }
                CreateTables(table, path);
            } catch (Exception e) { }
        }

        private void CreateTables(string table, string path) {
            switch (table) {
                case "scheduler":
                    Scheduler(path);
                    break;
                case "reservation":
                    Reservation(path);
                    break;
                default:
                    break;
            }
        }

        private void CreateTable(string path, string sql) {
            try {
                if (File.Exists(path)){
                    SQLiteConnection connection = new SQLiteConnection("Data Source=" + path);
                    connection.Open();
                    SQLiteCommand command = new SQLiteCommand(sql, connection);
                    command.ExecuteNonQuery();
                    connection.Close();
                };
            } catch (Exception e) { }
        }

        public string GetDataBasePath(string dataBase) {
            return HttpContext.Current.Server.MapPath(string.Format("~/data/{0}", dataBase));
        }
}