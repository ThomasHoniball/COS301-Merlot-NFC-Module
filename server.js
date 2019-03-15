const mysql = require('mysql'); 
//const forEach = require('forEach'); Stupid Heroku
var junit = require("junit")
var express = require('express');
var app = express();

const http = require('http');
const fs = require('fs');   

let client = "";

const start = () => {
	const onRequest = function(request, response){
		if(request.method == "GET")
		{
			console.log(request.url);
		}

		let pos = request.url.indexOf('=');
		let value;
		if(request.url.includes('nfc_id'))
		{
			value = request.url.substring(pos + 1,request.url.length);
			authenticateNFCID(value).then(function(data){
				client = data;
				let html =
					`
					<!DOCTYPE html>
					<html lang="en">
					<head>
						<meta charset="utf-8">
						<meta http-equiv="X-UA-Compatible" content="IE=edge">
						<title>NFC Demo</title>
						<meta name="viewport" content="width=device-width, initial-scale=1">
					</head>
					<body>
						<h1>Phase 3 - Demo 1</h1>
						<hr>
						<h2>NFC Chip ID => Client ID</h2>
						<form action="" method="GET">
							<label>NFC Chip ID: </label><input name="nfc_id" type="number" id="nfc_id">
							<button type="submit">Find ClientID</button>
						</form>
						<br>
						<label>Card ID: </label><p>${client}</p>
						<br>
						<form action="" method="GET">
							<h2>Logs</h2>			       
							<label>Client ID: </label><input type="number" name="client_id">
							<button type="submit">Generate Logs</button>
							<br>
							<textarea id="json_output" cols="50" rows="5"></textarea>
						</form>
					</body>
					</html>
					`
					
				response.writeHead(200, {'Content-Type' : 'text/html'});
				response.write(html);
				response.end();
			});
		}
		else if(request.url.includes('client_id'))
		{
			value = request.url.substring(pos + 1,request.url.length);
			getAuditLog(value).then(function(data){
				client = data;
				let html = 
					`
					<!DOCTYPE html>
					<html lang="en">
					<head>
						<meta charset="utf-8">
						<meta http-equiv="X-UA-Compatible" content="IE=edge">
						<title>NFC Demo</title>
						<meta name="viewport" content="width=device-width, initial-scale=1">
					</head>
					<body>
						<h1>Phase 3 - Demo 1</h1>
						<hr>
						<h2>NFC Chip ID => Client ID</h2>
						<form action="" method="GET">
							<label>NFC Chip ID: </label><input name="nfc_id" type="number" id="nfc_id">
							<button type="submit">Find ClientID</button>
						</form>
						<br>
						<label>Client ID: </label><p></p>
						<br>
						<form action="" method="GET">
							<h2>Logs</h2>			       
							<label>Card ID: </label><input type="number" name="client_id">
							<button type="submit">Generate Logs</button>
							<br>
							<textarea id="json_output" cols="50" rows="5">${client}</textarea>
						</form>
					</body>
					</html>
					`	
				response.writeHead(200, {'Content-Type' : 'text/html'});
				response.write(html);
				response.end();
			});
		}
		else
		{
			let html =
				`
				<!DOCTYPE html>
				<html lang="en">
				<head>
					<meta charset="utf-8">
					<meta http-equiv="X-UA-Compatible" content="IE=edge">
					<title>NFC Demo</title>
					<meta name="viewport" content="width=device-width, initial-scale=1">
				</head>
				<body>
					<h1>Phase 3 - Demo 1</h1>
					<hr>
					<h2>NFC Chip ID => Client ID</h2>
					<form action="" method="GET">
						<label>NFC Chip ID: </label><input name="nfc_id" type="number" id="nfc_id">
						<button type="submit">Find ClientID</button>
					</form>
					<br>
					<label>Client ID: </label><p></p>
					<br>
					<form action="" method="GET">
						<h2>Logs</h2>			       
						<label>Card ID: </label><input type="number" name="client_id">
						<button type="submit">Generate Logs</button>
						<br>
						<textarea id="json_output" cols="50" rows="5"></textarea>
					</form>
				</body>
				</html>
				`
					
				response.writeHead(200, {'Content-Type' : 'text/html'});
				response.write(html);
				response.end();
		}
	}

	http.createServer(onRequest).listen(3000);
	console.log("Server has started, listening on port 3000");
}

start();

function authenticateNFCID(nfc_id){
	return new Promise(function(resolve, reject){
		let con = mysql.createConnection({
			host: "qbct6vwi8q648mrn.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
			user: "onqy5tpsj3s4y1bo",
			password: "ccjf24781zs40f9s",
			port:"3306",
			database: "tiiwm3tr2t946xrd"
		});

		let sql = "Select * from nfc_table where nfc_id = " + nfc_id;

		con.connect(function(err) {
			if (err)
			{
				throw err;
			}
			con.query(sql, function (err, result) {
				if (err)
				{
					throw err;
				}

				if(result.length > 0)
				{

					resolve(result['0'].client_id);
					cond.end();
				}
				else
				{
					resolve('NotAuthenticated');
					con.end();
				}
			});
		});
	});
}

function getAuditLog(card_id){
	return new Promise(function(resolve, reject){
		let con = mysql.createConnection({
			host: "qbct6vwi8q648mrn.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
			user: "onqy5tpsj3s4y1bo",
			password: "ccjf24781zs40f9s",
			port:"3306",
			database: "tiiwm3tr2t946xrd"
		});

		let sql = "Select * from audit_table where card_id = " + card_id;

		con.connect(function(err) {
			if (err)
			{
				throw err;
			}
			con.query(sql, function (err, result) {
				if (err)
				{
					throw err;
				}

				if(result.length > 0)
				{
					resolve(generateJSON(['audit_id','client_id','timestamp','authenticationStatus'],[result[0].audit_id,result[0].client_id,result[0].timestamp,result[0].authenticationStatus]).then(function(data){return data;}));
					con.end()
				}
				else
				{
					resolve(generateJSON(['error'],['NotAuthenticated']).then(function(data){return data;}));
					con.end();
				}
			});
		});

	});
}

function generateJSON(indexArguments, args)
{
	return new Promise(function(resolve, reject){
		let obj = new Object();
		indexArguments.forEach(function(element,index){
			obj[indexArguments[index]] = args[index];
		});
		resolve(JSON.stringify(obj));
	});
}

function Auth(id){
	authenticateNFCID(id).then(function(data){
		let id = [];
		id[0] = data;
		generateJSON(['client_id'], id).then(function(json){
			return json;
		});
	});
}

var it = junit();
(async () => {
    //Async tests.
    it("Valid Auth 1", () =>
        it.eq(authenticateNFCID(100001).then(function(data){return data}), 12121212)
    );
    it("Valid Auth 2", () =>
       	it.eq(authenticateNFCID(100000).then(function(data){return data}), 123456)
    );
     it("Invalid Auth 3", () =>
        it.eq(authenticateNFCID(1001).then(function(data){return data}),'NotAuthenticated')
    );

    it("Valid Audit 4", () =>
        it.eq(getAuditLog(0001).then(function(data){return data}), '{"audit_id":1,"client_id":123456,"timestamp":"2019-03-14T23:40:59.000Z","authenticationStatus":1}')
    );
     it("Valid Audit 5", () =>
        it.eq(getAuditLog(0002).then(function(data){return data}), '{"audit_id":2,"client_id":12121212,"timestamp":"2019-03-14T23:42:59.000Z","authenticationStatus":0}')
    );
    it("Invalid Audit 6", () =>
        it.eq(getAuditLog(0003).then(function(data){return data}), '{"error":"NotAuthenticated"}')
    );
    it.run();
})();