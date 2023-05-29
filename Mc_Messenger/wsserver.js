import { createServer } from 'http';
import * as fs from 'fs';
import { WebSocketServer } from 'ws';
import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const port = process.argv[2] || 8080;
const urlpath = process.argv[3];

let indexFile;
// Serve requested files to connected client
const requestListener = function (req, res) {
	let contentType = "text/html";
    console.log(req.url);
    let url = req.url;
    const enc = "utf8";
    switch(url){
		case "/":
		url = "/index.html";
		break;
		case "/css/style.css":
		case "/css/regular.css":
		case "/css/frame.css":
		case "/css/modal.css":
		case "/css/color_themes/dark_theme.css":
		case "/css/color_themes/dhbw_theme.css":
		case "/css/color_themes/light_theme.css":
		contentType = "text/css";
		break;
		case "/js/main.js":
		case "/js/nacl.js":
		case "/js/nacl-util.js":
		case "/js/message.js":
		case "/js/user.js":
		case "/js/ui.js":
		contentType = "application/javascript";
		break;
		case "/fonts/fa-regular-400.woff2":
		contentType = "font/woff2";
        res.setHeader("Content-Type", contentType);
        res.writeHead(200);
        res.end(fs.readFileSync("data" + url));
        return;
		case "/favicon.ico":
		break;
		case "/img/cookie.webp":
		contentType = "image/webp";
		res.setHeader("Content-Type", contentType);
		res.writeHead(200);
		res.end(fs.readFileSync("data" + url));
		return;
		break;
	}
	url = "data" + url;
	let data = ""
    fs.readFile(url, enc, function(err, data){
        if(err){
            return console.log(err);
        }
        
        // Ugly hack to replace port number dynamically
        if(url == "data/js/message.js"){
            data = data.replace(/(const port ?= ?)[0-9]{4,5}(.+)/, "$1"+ port + "$2");
            if(urlpath){
                data = data.replace("const urlpath = null;", "const urlpath = \""+ urlpath + "\";");
            }
        }
       
        res.setHeader("Content-Type", contentType);
        res.writeHead(200);
        res.end(data);
    });
}

const server = createServer({}, requestListener);
		
server.listen(port,'::');

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
