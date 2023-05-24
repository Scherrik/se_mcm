(function(msghandler) {
'use strict';

function areWeTestingWithJest() {
    return typeof jest !== 'undefined';
}

var salt;
if(typeof module !== 'undefined'){
    console.log("MODULE FOUND");
    salt = require("./nacl.js");
    salt.util = require("./nacl-util.js");
} else {
    salt = nacl;
    salt.util = nacl.util;
  
}

const BROADC_ADDR = 0xFFFF;
//const db = new Map();
var soc;

const typeMap = new Map();
/*
typeMap.set('hello-client', 1);
typeMap.set('hello-world', 2);
typeMap.set('db-sync', 3);
typeMap.set('server-poll', 4);
typeMap.set('token-handover', 5);
typeMap.set('byebye-client', 16);
typeMap.set('message', 128);
typeMap.set('meta-info', 129);
typeMap.set('poll', 130);
typeMap.set('file', 131);
*/

typeMap.set('serverHello', 1);
typeMap.set('clientHello', 2);
typeMap.set('hostHello', 3);
typeMap.set('clientGoodbye', 4);
typeMap.set('dbSync', 8);
typeMap.set('serverPoll', 9);
typeMap.set('tokenHandover', 10);
typeMap.set('message', 128);
typeMap.set('metaInfo', 129);
typeMap.set('poll', 130);
typeMap.set('file', 131);

let eventMap = new Map();

if(areWeTestingWithJest()){
    eventMap.set("mh_onconnect",    new Event("mh_onconnect", { detail: {} }));
    eventMap.set("mh_newuser",      new Event("mh_newuser", { detail: {} }));
    eventMap.set("mh_dbsync",       new Event("mh_dbsync", { detail: {} }));
    eventMap.set("mh_messagerecv",  new Event("mh_messagerecv", { detail: {} }));
    eventMap.set("mh_metachange",   new Event("mh_metachange", { detail: {} }));
    eventMap.set("mh_tokenchange",  new Event("mh_tokenChange", {detail: {} }));
    eventMap.set("mh_cldisconnect", new Event("mh_cldisconnect", {detail: {} }));
    eventMap.set("mh_messagesent",  new Event("mh_messagesent", {detail: {} }));
} else {
    eventMap.set("mh_onconnect", new CustomEvent("mh_onconnect", { detail: {} }));
    eventMap.set("mh_newuser", new CustomEvent("mh_newuser", { detail: {} }));
    eventMap.set("mh_dbsync", new CustomEvent("mh_dbsync", { detail: {} }));
    eventMap.set("mh_messagerecv", new CustomEvent("mh_messagerecv", { detail: {} }));
    eventMap.set("mh_metachange", new CustomEvent("mh_metachange", { detail: {} }));
    eventMap.set("mh_tokenchange", new CustomEvent("mh_tokenChange", {detail: {} }));
    eventMap.set("mh_cldisconnect", new CustomEvent("mh_cldisconnect", {detail: {} }));
    eventMap.set("mh_messagesent", new CustomEvent("mh_messagesent", {detail: {} }));
}
function typeToString(id){
	for (const [key, value] of typeMap) {
		if(value == id) return key;
	}
	return "NO TYPE FOUND";
	//return [...typeMap.values()].find(([key,val]) => id == value)[0];
}

// Helper function to determine if a string is empty
function isEmpty(str){
	return (!str || str.trim().length === 0);
}

// Using an async function to handle incoming messages
async function extract(blob){
	(blob.text().then(
		value => msghandler.processIncomingMessage(value)));
}


// Initialize websocket connection and its handlers
msghandler.init = function(){
	const socketProtocol = (window.location.protocol === 'https:' ? 'wss:' : 'ws:')
    const port = 8080; // Will be replaced by node.js dynamically through startup param
	soc = new WebSocket(`${socketProtocol}//${window.location.hostname}:${port}/ws`);
	soc.onmessage = function(event) {
		extract(event.data);
	}
	soc.onerror = function(event){
		FLAG_TEST_LOCAL = true;	
	}
	soc.ondisconnect = function(event){
		FLAG_TEST_LOCAL = true;	
		// TODO Try reconnect...
	}
}



/* Data API Definition:
 * 	Message:
 * 		{
 * 			"sid": sid,			// sender (id) 
 * 			"rid": [rid,...],	// receiver list (ids)
 * 			"typ": 0,			//type 0 = server(not encrypted), type 2 = message(encrypted*), type 3 = meta info change(encrypted*), type 4 = poll(encrypted*) => * encryption not implemented yet
 * 			"pk": "...",
 * 			//Data NOT ENCRYPTED 
 * 			"da": {
 * 				"pk": "..."//public key on init (first device public key only) OR ...
 * 				"pl": [0,0,0] // handle poll statistics (how many answers..., count and calculate results and send them to the participants devices...)
 * 			}, 	//data type server OR
 * 			//Data ENCRYPTED
 * 			"da": {
 * 				"pl": "...", 	//payload
 * 				"fl": 0,		//flags
 * 				"cl": #...		//color
 * 			}, 	//data type chat message OR
 * 			//Data ENCRYPTED
 * 			"da": {
 * 				"na": "...", 	//name
 * 				"fl": 0,		//flags
 * 				"cl": #...		//color
 * 			}, 	//data type meta info change message OR
 * 			//Data Encrypted
 * 			"da": {
 * 				"qu": "...?",
 * 				"an": ["...", "...", ...]
 * 			} 	//data type poll
 * 		}
 * */
function createFrame(type, receiver_list){
	// Create the header of a message, which contains:
	//   - the clients id itself (sid = sender id) 
	//   - the receiver id (or multiple receiver ids) 
	//   - the type of message 
	//   - a data field with the payload
	return {
		"sid": userdb.me.id,
		"rid": receiver_list,
		"typ": typeMap.get(type),			//type 0 = server(not encrypted), type 2 = message(encrypted), type 3 = poll(encrypted)
		"da": []
	};
}

function createPayload(type, msgObj = {}){
	// In dependency of the type of a message,
	// different named fields will be used as the message payload
	let result = {}
	console.log("CREATE " + type + " PAYLOAD");
	switch(type){
		// "message consists of: "pl" = payload, "fl" = flags (angry, ...)
		case "message":
			result["pl"] = msgObj;
			result["fl"] = userdb.me.fl;
		break;
		// "meta-info" consists of: "na" = name, "cl" = color
		case "metaInfo":
			result["na"] = userdb.me.na;
			result["cl"] = userdb.me.cl;
		break;
		// "server-poll" consists of: TODO >> NOT IMPLEMENTED YET
		case "serverPoll":
			// Not implemented yet
			result = ""; 
		break;
		// "db-sync" consists of: "db" = the user database, see userdb.toObject()
		case "dbSync":
			result["db"] = userdb.toObject(); 
		break;
		case "clientHello":
		case "hostHello":
			// "hello-world" consists of: "pk" = public key of the client
			result["pk"] = bytesToString(userdb.me.keys.publicKey); 
		break;
		case "poll":
			// "poll" consists of: "qu" = question, "an" = the possible answers as an array ( SEE "server-poll" >> NOT IMPLEMENTED YET )
			result["qu"] = msgObj.question;
			result["an"] = msgObj.answers;
		break;
		default:
			// Couldn't identify message type
			result = "WRONG TYPE " + type;
			console.error(result);
		break;
	}
	return result;
}
	
msghandler.processIncomingMessage = function(json_str){
	// The incoming message will be interpreted as a JSON obj
	console.log(json_str);
	let json_obj = JSON.parse(json_str);
	let e; // Custom Event
	if(!json_obj){
		return;
	}
	// On success the client extracts the header and interprets the message depending on the type
	let type = typeToString(json_obj["typ"]);
	console.log("RECEIVED " + type + " Message");
	
	// If it's our client which sent the message, we can ignore the message if it's of specific type
	if(json_obj["sid"] == userdb.me.id && (type == "clientHello" || type == "metaInfo"	))
		return;
	
	switch (type) {
		//Server message on init, properties: "yid"=ClientID(yourID), "dbs"=User database size, "
		case "serverHello":
			userdb.me.id = json_obj["yid"];
			e = eventMap.get("mh_onconnect");
			e.detail.id = json_obj["yid"];
			let db_size = json_obj["dbs"];
			let resp_obj = {}
			if(db_size == 0){
				// Nobody is online, so the client is the host of the session
				//userdb.setHostToken(true);
				console.log("I'm first host");
				e.detail.dbToken = true;
			} else {
				// Send a broadcast message to say hello to all other clients
				resp_obj = createFrame("clientHello", [BROADC_ADDR]);
				resp_obj["da"] = createPayload("clientHello");
				soc.send(JSON.stringify(resp_obj));
			}
			document.dispatchEvent(e);
			break;
		case "clientHello":
			// If the client is the sender of a hello-world message, it can ignore it
			if(json_obj["sid"] == userdb.me.id) return;
			
			// Send new user 
			e = eventMap.get("mh_newuser");
			e.detail.id = json_obj["sid"];
			e.detail.pk = stringToBytes(json_obj["da"]["pk"]);
			document.dispatchEvent(e);
			
			// If the client is the host of the session, 
			// it has to respond with a "hello_world" message 
			// and after a small amount of time respond with a "db-sync" message 
			// which contains the user database
			if(userdb.hostToken()){
				//Preparation of "hello world" and "db-sync" messages"
				console.log("got token, send hello_world response and db");
				var obj = createFrame("hostHello", [json_obj["sid"]]);
				obj["da"] = createPayload("hostHello");
				soc.send(JSON.stringify(obj));
				obj = createFrame("dbSync", [json_obj["sid"]]);
				obj["da"] = createPayload("dbSync");
				var json = JSON.stringify(obj);
				setTimeout(function(){ 
					soc.send(json);
					// After sending the "db-sync" message, the newly connected client becomes the host of the session, so remove the token
					console.log("Removed db host token");
					e = eventMap.get("mh_tokenchange");
					e.detail.dbTok = false;
					document.dispatchEvent(e);
					console.log("done");
				}, 250);
			}
			
			//userdb.updateUser(, { na: "Default", cl: "black", pk: stringToBytes(json_obj["da"]["pk"])})
			break;
		case "dbSync":
			// when a new client connects to mcm, he gets this message
			e = eventMap.get("mh_dbsync");
			e.detail.dbTok = true;
			e.detail.db = json_obj["da"]["db"];
			document.dispatchEvent(e);
			console.log("Now I'm new db host provider");
			break;
		case "tokenHandover":
			e = eventMap.get("mh_tokenchange");
			e.detail.dbToken = true;
			document.dispatchEvent(e);
			// Needed if the old host was disconnected, send by server automatically
			// userdb.dbHostToken = true;
			break;
		case "clientGoodbye":
			// Notification for all other clients about a disconnectiing client
			e = eventMap.get("mh_cldisconnect");
			e.detail.cid = json_obj["cid"];
			document.dispatchEvent(e);
			break;
		//Chat message
		case "message":
			//decryptPayload(json_obj);
			// Check if angry flag is set, and if so start angry mode for 5seconds
			if(json_obj["da"]["fl"] & IS_ANGRY){
				angrymode();
				setTimeout(function(){ angrymode(); }, 5000);
			}
			// Add color and name to the json object before it will be added to the chat box
			e = eventMap.get("mh_messagerecv");
			e.detail.msg = json_obj;
			document.dispatchEvent(e);
			
			//addMessageToChatBox(json_obj);
			break;
		//Meta change
		case "metaInfo":
			// A name or color change was recognized and will be written to the user database
			/*
			userdb.updateUser(
				json_obj.sid,
				{
				  na: json_obj["da"]["na"], 
				  cl: json_obj["da"]["cl"]
				}
			)
			*/ 
			e = eventMap.get("mh_metachange");
			e.detail.id = json_obj.sid;
			e.detail.meta = json_obj["da"];
			document.dispatchEvent(e);
			break;
		//Poll
		case "poll":
			break;
		default:
			console.log("DEFAULT NOTHING TODO...");
			break;
	}
}

function encryptPayload(secretKey, rcvrPubKey, msg){
	let nonce = new Uint8Array(salt.box.nonceLength);
	let message = salt.util.decodeUTF8(msg);
	let result = salt.box(message, nonce, rcvrPubKey, secretKey);
	return result;
}

function decryptPayload(secretKey, sndrPubKey, msgUint8_Array){
	let nonce = new Uint8Array(salt.box.nonceLength);
	let ui8a = Uint8Array.from(msgUint8_Array);
	let obox = salt.box.open(ui8a, nonce, sndrPubKey, secretKey);
	return salt.util.encodeUTF8(obox);
}
	
msghandler.sendMessage = function(msg){
	console.log("Send message");
	//let msg = document.getElementById("msg_input").value;
	
	if(isEmpty(msg)){
		console.log("Empty message, nothing to do...");
		return;
	}	
	/*
	 * TODO Extract name from message and determine id(s) from belonging user 
	 */ 
	
	let e = eventMap.get("mh_messagesent");
	
	let frame = createFrame("message", [BROADC_ADDR]/* Has to be replaced by real receiver list */);
	e.detail.header = frame;
	
	frame["da"] = createPayload("message", msg);
	/* Encryption part
	let enc = JSON.stringify(messageHandler.create(msg, "msg"));
	enc = encryptPayload(enc, myUser.keys.publicKey ); //Has to be replaced by receiver public keys
	enc.forEach(ele => frame["da"].push(ele));
	*/
	let jsonFrame = JSON.stringify(frame);
	soc.send(jsonFrame);
	e.detail.payload = frame["da"];
	document.dispatchEvent(e);
	
	if(FLAG_TEST_LOCAL){
		frame["na"] = userdb.me.na;
		frame["cl"] = userdb.me.cl;
		addMessageToChatBox(frame);
	}
}
	
msghandler.sendMetaChange = function(){
	let frame = createFrame("metaInfo", [BROADC_ADDR]);
	frame["da"] = createPayload("metaInfo");
	
	let jsonFrame = JSON.stringify(frame);
	soc.send(jsonFrame);
	if(FLAG_TEST_LOCAL){
		frame["na"] = userdb.me.na;
		frame["cl"] = userdb.me.cl;
		frame["da"]["pl"] = "Meta-Info change";
		addMessageToChatBox(frame);
	}
}


// TESTONLY
msghandler.__get__ = function(name){
    switch(name){
        case "encrypt":
            return encryptPayload;
            break;
        case "decrypt":
            return decryptPayload;
            break;
        case "createPayload":
            return createPayload;
            break;
        case "createFrame":
            return createFrame;
            break;
        case "isEmpty":
            return createPayload;
            break;
    }
}

})(typeof module !== 'undefined' && module.exports ? module.exports : (self.msghandler = self.msghandler || {}));
//const MessageHandle = new MessageHandler();
//Object.freeze(MessageHandle);
/*
export default messageHandler; 
*/
