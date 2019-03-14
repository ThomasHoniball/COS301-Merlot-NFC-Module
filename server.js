const http = require('http');

const start = () => { 
	const onRequest = (request, response)  => { 
	response.writeHead(200, {'Content-Type': 'text/html'}); 
	response.write('Working'); 
	response.end(); 
	}

	http.createServer(onRequest).listen(8888); console.log('Server has started');
}

exports.start = start;