function update()
{

	var mysql = require('mysql');

	var mainDB = mysql.createConnection({
		host: "localhost",
		user: "root",
		password: "BunnyRabbit64",
		database: "main_db"
	});
	//var data = "";
	mainDB.connect(function(err) {
		if (err) throw err;
		console.log("Connected to main Database");
		mainDB.query("SELECT * FROM tbl_client", function (err, result, fields) {
			if (err) throw err;
			console.log("Retrieving data from main Database");
			console.log(result);
			var data = result;
			var nfcDB = mysql.createConnection({
				host: "localhost",
				user: "root",
				password: "BunnyRabbit64",
				database: "nfc_db"
			});
			//nfcDB.query()

			nfcDB.connect(function(err) {
				if (err) throw err;
				console.log("Connected to internal NFC Database");
				var sql = "INSERT INTO tbl_client (client_id, card_id) VALUES ?";
				//while(typeof data != "object"){}
				//console.log("Data: " + data[0].client_id);
				var values = [];
				for(var row in data)
				{
					//console.log(row);
					var item = [data[row].client_id, data[row].card_id];
					//console.log(item[0] + " " + item[1]);
					values.push(item);
				}
				//console.log(values);
				nfcDB.query(sql, [values], function (err, result) {
					if (err) throw err;
					console.log("Number of records inserted: " + result.affectedRows);
				});	
				nfcDB.end();

			});
		});
		mainDB.end();
		console.log("Closed connection with main Database");
	});
	//while(typeof data != "object"){}



}

update();