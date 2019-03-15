var mysql = require("mysql");

const pool = mysql.createPool({
            connectionLimit : 10,
            host     : 'localhost',
            user     : 'root',
            password : '',
            database : 'nfc',
            debug    : false 
            });                    

function executeQuery(sql, callback) {
    console.log("In Execute Query");
    pool.getConnection((err,connection) => {
        if(err) {
            console.log("Error in GEt Connection");
            return callback(err, null);
        } else {
            if(connection) {
                connection.query(sql, function (error, results, fields) {
                connection.release();
                if (error) {
                    return callback(error, null);
                } 
                return callback(null, results);
                });
            }
        }
    });
}

function query(sql, callback) {
    console.log("In db Query");

    executeQuery(sql,function(err, data) {
        if(err) {
            return callback(err);
        }       
        callback(null, data);
    });
}

module.exports = {
    query: query
}