function authenticateNFCID(nfc_id){
	return new Promise(function(resolve, reject){
		let con = mysql.createConnection({
			host: "localhost",
			user: "root",
			password: "",
			database: "nfc"
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
				}
				else
				{
					resolve('NotAuthenticated');
				}
			});
		});
	});
}

function getAuditLog(card_id){
	return new Promise(function(resolve, reject){
		let con = mysql.createConnection({
			host: "localhost",
			user: "root",
			password: "",
			database: "nfc"
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
				}
				else
				{
					resolve(generateJSON(['error'],['NotAuthenticated']).then(function(data){return data;}));
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