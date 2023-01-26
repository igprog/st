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

    //public void Scheduler(string path) {
    //    string sql = @"CREATE TABLE IF NOT EXISTS scheduler
    //            (room INTEGER,
    //            clientId VARCHAR(50),
    //            content NVARCHAR(200),
    //            startDate INTEGER,
    //            endDate INTEGER,
    //            userId VARCHAR(50))";
    //    CreateTable(path, sql);
    //}

    public void Scheduler(string path) {
        string sql = @"CREATE TABLE IF NOT EXISTS scheduler
                (id VARCHAR (50) PRIMARY KEY,
                room INTEGER,
                clientId VARCHAR(50),
                content NVARCHAR(200),
                startTime VARCHAR(50),
                endTime VARCHAR(50),
                userId VARCHAR(50))";
        CreateTable(path, sql);

        RepairColumns(path);

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
        }
        catch (Exception e) {
        }
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
        }
        catch (Exception e) {
        }
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
            if (File.Exists(path)) {
                using (var connection = new SQLiteConnection("Data Source=" + path)) {
                    connection.Open();
                    using (var command = new SQLiteCommand(sql, connection)) {
                        command.ExecuteNonQuery();
                    }
                }
            };
        }
        catch (Exception e) {
        }
    }

    public string GetDataBasePath(string dataBase) {
        return HttpContext.Current.Server.MapPath(string.Format("~/data/{0}", dataBase));
    }

    private void RepairColumns(string path) {
        try {
            if (!CheckIfColumnExists("scheduler", "id")) {
                string tempTable = string.Format("sqlitestudio_temp_table_{0}", Guid.NewGuid().ToString().Replace("-", ""));
                string sql = string.Format(@"ALTER TABLE scheduler RENAME TO {0};
                        CREATE TABLE scheduler (id VARCHAR (50) PRIMARY KEY, room INTEGER, clientId VARCHAR (50), content NVARCHAR (200), startTime VARCHAR (50), endTime VARCHAR (50), userId VARCHAR (50));
                        INSERT INTO scheduler (room, clientId, content, startTime, endTime, userId) SELECT room, clientId, content, startDate, endDate, userId FROM {0};
                        DROP TABLE {0};", tempTable);
                using (var connection = new SQLiteConnection("Data Source=" + path)) {
                    connection.Open();
                    using (var command = new SQLiteCommand(sql, connection)) {
                        command.ExecuteNonQuery();
                    }
                }
            }
        } catch (Exception e) {
            var err = e.Message;
        }
    }

    public bool CheckIfColumnExists(string tableName, string columnName) {
        var path = GetDataBasePath(G.dataBase);
        var isExists = false;
        using (var connection = new SQLiteConnection("Data Source=" + path)) {
            connection.Open();
            using (var cmd = connection.CreateCommand()) {
                cmd.CommandText = string.Format("PRAGMA table_info({0})", tableName);
                var reader = cmd.ExecuteReader();
                int nameIndex = reader.GetOrdinal("Name");
                while (reader.Read()) {
                    if (reader.GetString(nameIndex).Equals(columnName)) {
                        isExists = true;
                    }
                }
            }
        }
        return isExists;
    }
}