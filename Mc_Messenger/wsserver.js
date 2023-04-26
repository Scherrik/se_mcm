import { createServer } from 'http';
import { readFileSync } from 'fs';
import { WebSocketServer } from 'ws';
import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


let indexFile;
const requestListener = function (req, res) {
	let contentType = "text/html";
    console.log(req.url);
    let url = req.url;
    switch(url){
		case "/":
		url = "/index.html";
		break;
		case "/css/style.css":
		case "/css/regular.css":
		case "/css/frame.css":
		contentType = "text/css";
		break;
		case "/js/main.js":
		case "/js/nacl.js":
		case "/js/nacl-util.js":
		case "/js/message.js":
		case "/js/user.js":
		case "/js/main.js":
		contentType = "application/javascript";
		break;
		case "/fonts/fa-regular-400.woff2":
		contentType = "font/woff2";
		break;
		case "/favicon.ico":
		break;
	}
	url = "data" + url;
	let data = ""
	try {
		data = readFileSync(url);
	} catch(e) {
		console.log("Error: ", e);
	}
	
	res.setHeader("Content-Type", contentType);
    res.writeHead(200);
    res.end(data);
}

const server = createServer({
  cert: readFileSync('cert/certificate.pem'),
  key: readFileSync('cert/privatekey.pem')
}, requestListener);
		
server.listen(8080,'::');

const wss = new WebSocketServer({ server });

const BROADC_ADDR = 0xFFFF;
let id_count = 1;
var tokenId;
wss.on('connection', function connection(ws) {
	console.log("Connection received");
	ws.on('error', console.error);
	
	ws.on('message', function message(data) {
		console.log('received: %s', data);
		// Extract header
		let jobj = JSON.parse(data);
		if(jobj.rid.length === 0) return;
		
		if(jobj.rid.length === 1 && jobj.rid[0] === BROADC_ADDR){
			console.log("BROADCAST MESSAGE");
			//wss.broadcast(data, {binary:true});
			wss.clients.forEach(function(client) {
				client.send(data, {binary:true});
			});
		} else {
			console.log("DEDICATED RECEIVER MESSAGE");
			wss.clients.forEach(function(client){
					console.log(client.id);
					if(jobj.rid.indexOf(client.id) !== -1 || (jobj.sid == client.id && jobj.typ != 3/*db_sync*/)){
						client.send(data, {binary:true});
					}
				}
			);
		}
	});
	
	ws.on('close', function disconnect(){
		console.log("CONNECTION CLOSED " + ws.id);
		if(wss.clients.size > 0){
			if(ws.id == tokenId){
				let newHost = [...wss.clients].pop();
				tokenId = newHost.id;
				newHost.send("{\"sid\": 0, \"rid\": [" + tokenId + "], \"typ\": 5 }", {binary:true});
			}
			wss.clients.forEach(function(client) {
				client.send("{\"sid\": 0, \"rid\": [" + BROADC_ADDR + "], \"typ\": 16, \"cid\":" + ws.id + " }", {binary:true});
			});
		}
	});
	
	let clsize = wss.clients.size - 1; // Subtract the own client from the total db size
	ws.id = id_count++;	
	tokenId = ws.id;
	var str = `{"typ":1,"yid":${ws.id},"dbs":${clsize}}`;
	ws.send(str, {binary: true});
});
