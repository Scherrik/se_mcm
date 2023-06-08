(function(msghandler) {
'use strict';


var salt;
var udb;
var helpster;
if(typeof module !== 'undefined'){
    // FOR JEST UNIT TESTING
    console.log("MODULE FOUND");
    salt = require("./nacl.js");
    salt.util = require("./nacl-util.js");
    
    helpster = require("./helper.js");
    
    // TEST DB 
    udb = require("./user.js");
    udb.init();
} else {
    salt = nacl;
    salt.util = nacl.util;
    udb = userdb;
    helpster = helper;
}

const BROADC_ADDR = 0xFFFF;

var soc;

const typeMap = new Map();

typeMap.set('serverHello', 1);
typeMap.set('clientHello', 2);
typeMap.set('hostHello', 3);
typeMap.set('clientGoodbye', 4);
typeMap.set('tokenHandover', 5);
typeMap.set('dbSync', 8);
typeMap.set('serverPoll', 9);
typeMap.set('message', 128);
typeMap.set('metaInfo', 129);
typeMap.set('poll', 130);
typeMap.set('file', 131);
typeMap.set('cookie', 132);
typeMap.set('interaction', 133);


function typeToString(msg_id){
	for (const [key, value] of typeMap) {
		if(value == msg_id) return key;
	}
	console.warn("Could not identify message");
	return "NO TYPE FOUND";
	//return [...typeMap.values()].find(([key,val]) => id == value)[0];
}

let dbHostToken = false;

function getToken() {
    return dbHostToken;
}

function setToken(b){
    dbHostToken = b;
    let e = helpster.createEvent("mh_tokenchange");
    e.detail.token = b;
    document.dispatchEvent(e);
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
    const urlpath = null;
    if(urlpath){
        soc = new WebSocket(`${socketProtocol}//${window.location.hostname}/${urlpath}/ws`);
    } else {
        soc = new WebSocket(`${socketProtocol}//${window.location.hostname}:${port}/ws`);
    }
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
		"sid": udb.me.id,
		"rid": receiver_list,
		"typ": typeMap.get(type),			//type 0 = server(not encrypted), type 2 = message(encrypted), type 3 = poll(encrypted)
		"da": []
	};
}

function createPayload(type, msgObj = {}){
	// In dependency of the type of a message,
	// different named fields will be used as the message payload
	let result = {}
	console.info("CREATE " + type + " PAYLOAD");
	switch(type){
		// "message consists of: "pl" = payload, "fl" = flags (angry, ...)
		case "message":
			result["pl"] = msgObj;
			result["fl"] = udb.me.fl;
		break;
		// "meta-info" consists of: "na" = name, "cl" = color
		case "metaInfo":
			result["na"] = udb.me.na;
			result["cl"] = udb.me.cl;
		break;
		// "server-poll" consists of: TODO >> NOT IMPLEMENTED YET
		case "serverPoll":
			// Not implemented yet
			result = {}; 
		break;
		// "db-sync" consists of: "db" = the user database, see userdb.toObject()
		case "dbSync":
			result["db"] = udb.toObject();
		break;
		case "clientHello":
		case "hostHello":
			// "hello-world" consists of: "pk" = public key of the client
			result["pk"] = [...udb.me.keys.publicKey];
		break;
		case "poll":
			// "poll" consists of: "qu" = question, "an" = the possible answers as an array ( SEE "server-poll" >> NOT IMPLEMENTED YET )
			result["qu"] = msgObj.question;
			result["an"] = msgObj.answers;
			result["id"] = msgObj.id;
		break;
		case "interaction":
			result["pl"] = msgObj;
		break;
		default:
			// Couldn't identify message type
			result = "WRONG TYPE " + type;
			console.error(result);
		break;
	}
	return result;
}

// "{\"sid\": 0,\"rid\": [0, 23, 45], \"typ\": 0, \"da\": }"
// "{ \"typ\":1,\"yid\":1234,\"dbs\":0}"

let prev_sent_msg;

msghandler.processIncomingMessage = function(json_str){
	// The incoming message will be interpreted as a JSON obj
	console.debug(json_str);
	let json_obj = JSON.parse(json_str);
	let e; // Custom Event
	if(!json_obj){
		return;
	}
	
	
	let type = typeToString(json_obj["typ"]);
	// If it's our client which sent the message, we can ignore the message if it's of specific type
	if(json_obj["sid"] == udb.me.id){
        if(type == "message"){
			e = helpster.createEvent("mh_messagerecv");
			e.detail.msg = prev_sent_msg;
            document.dispatchEvent(e);
            return;
        }
        else if(type == "clientHello" || type == "metaInfo"	){
            return;
        }
    }
    
	// On success the client extracts the header and interprets the message depending on the type
	console.log("RECEIVED " + type + " Message");
	
	switch (type) {
		//Server message on init, properties: "yid"=ClientID(yourID), "dbs"=User database size, "
		case "serverHello":
			udb.me.id = json_obj["yid"];
			e = helpster.createEvent("mh_onconnect");
			e.detail.id = json_obj["yid"];
			let db_size = json_obj["dbs"];
			let resp_obj = {}
			if(db_size == 0){
				// Nobody is online, so the client is the host of the session
				//userdb.setHostToken(true);
				//e.detail.dbToken = true;
                setToken(true);
                userdb.createGroup(BROADC_ADDR, "All");
			} else {
				// Send a broadcast message to say hello to all other clients
				resp_obj = createFrame("clientHello", [BROADC_ADDR]);
				resp_obj["da"] = createPayload("clientHello");
				soc.send(JSON.stringify(resp_obj));
			}
			//document.dispatchEvent(e);
			break;
		case "clientHello":
			// If the client is the sender of a hello-world message, it can ignore it
			if(json_obj["sid"] == udb.me.id) return;
			
			// Send new user 
			e = helpster.createEvent("mh_newuser");
			e.detail.id = json_obj["sid"];
			e.detail.pk = [...json_obj["da"]["pk"]];
            document.dispatchEvent(e);
			
			// If the client is the host of the session, 
			// it has to respond with a "hello_world" message 
			// and after a small amount of time respond with a "db-sync" message 
			// which contains the user database
			if(getToken()){
				//Preparation of "hello world" and "db-sync" messages"
				console.info("got token, send hello_world response and db");
				var obj = createFrame("hostHello", [json_obj["sid"]]);
				obj["da"] = createPayload("hostHello");
				soc.send(JSON.stringify(obj));
				obj = createFrame("dbSync", [json_obj["sid"]]);
				obj["da"] = createPayload("dbSync");
				var json = JSON.stringify(obj);
				setTimeout(function(){ 
                    console.log("Send database and remove token");
					soc.send(json);
					// After sending the "db-sync" message, the newly connected client becomes the host of the session, so remove the token
                    setToken(false);
					console.log("done");
				}, 250);
			}
			return;
        case "hostHello":
            e = helpster.createEvent("mh_newuser");
			e.detail.id = json_obj["sid"];
			e.detail.pk = [...json_obj["da"]["pk"]];
            break;
		case "dbSync":
            setToken(true);
			e = helpster.createEvent("mh_dbsync");
			e.detail.db = json_obj["da"]["db"];
			break;
		case "tokenHandover":
            setToken(true);
			break;
		case "clientGoodbye":
			// Notification for all other clients about a disconnectiing client
			e = helpster.createEvent("mh_cldisconnect");
			e.detail.cid = json_obj["cid"];
			//document.dispatchEvent(e);
			break;
		//Chat message
		case "message":
            //let bytes = helpster.stringToBytes(json_obj.da);
            if(json_obj.rid[0] == BROADC_ADDR){
                json_obj.da = JSON.parse(decryptPayload(udb.others.get(BROADC_ADDR).sk, udb.others.get(json_obj["sid"]).pk, json_obj.da));
            } else {
                json_obj.da = JSON.parse(decryptPayload(udb.me.keys.secretKey, udb.others.get(json_obj["sid"]).pk, json_obj.da));
            }
			e = helpster.createEvent("mh_messagerecv");
			e.detail.msg = json_obj;
			break;
		//Meta change
		case "metaInfo":
			// A name or color change was recognized and will be written to the user database
			e = helpster.createEvent("mh_metarecv");
			e.detail.id = json_obj.sid;
			e.detail.meta = json_obj["da"];
			break;
		//Poll
		case "poll":
			e = helpster.createEvent("mh_messagerecv");
			e.detail.msg = json_obj;
			//document.dispatchEvent(e);
			break;
		//Cookie
		case "cookie":
			e = helpster.createEvent("mh_messagerecv");
			e.detail.msg = json_obj;
			//document.dispatchEvent(e);
			break;
		//Global Ineraction
		case "interaction":
			e = helpster.createEvent("mh_interactionrecv");
			e.detail.msg = json_obj;
			//document.dispatchEvent(e);
			break;
		default:
			console.log("DEFAULT NOTHING TODO...");
			break;
	}
	
	if(e){
        document.dispatchEvent(e);
    }
	
}

function encryptPayload(secretKey, rcvrPubKey, msg){
    console.info("Encrypt payload => " + msg);
	let nonce = new Uint8Array(salt.box.nonceLength);
	let message = salt.util.decodeUTF8(msg); // String => Uint8Array
    console.debug(message);
	let result = salt.box(message, nonce, rcvrPubKey, secretKey);
    console.debug(result);
    return result.toLocaleString();
	return salt.util.encodeUTF8(); // Uint8Array => String
}

function decryptPayload(secretKey, sndrPubKey, msg){
	let nonce = new Uint8Array(salt.box.nonceLength);
	//let ui8a = Uint8Array.from(msgUint8_Array);
    //let ui8a = Uint8Array.from(msgarr);
    console.info("Decrypt payload => " + msg);
    let message = Uint8Array.from(msg.split(",").map(Number));
    console.debug(message);
	//let message = salt.util.decodeUTF8(msg); // String => Uint8Array
	let obox = salt.box.open(message, nonce, sndrPubKey, secretKey);
    console.debug(obox);
	return salt.util.encodeUTF8(obox); // Uint8Array => String
}
	
msghandler.sendMessage = function(msg){
    
    let rx_addr = BROADC_ADDR;
    if(msg.startsWith("@")){
        let rx_name = msg.substring(1, msg.indexOf(" "));
        rx_addr = udb.getIdByName(rx_name);
        console.debug("NAME: " + rx_name + " | ADDR: " + rx_addr);
    }
    
	if(helpster.isEmpty(msg)){
		console.info("Empty message, nothing to do...");
		return;
	}else if(msg === "#cookie"){
		console.info("COOKIE");
		var frame = createFrame("cookie", [rx_addr]/* Has to be replaced by real receiver list */);
		//frame["da"] = createPayload("message", msg);
	}else{
		var frame = createFrame("message", [rx_addr]/* Has to be replaced by real receiver list */);
		//frame["da"] = createPayload("message", msg);
	}
	/*
	 * TODO Extract name from message and determine id(s) from belonging user 
	 */
    
	// Encryption part
	
	let payload = createPayload("message", msg);
    let enc = JSON.stringify(payload);
    enc = encryptPayload(udb.me.keys.secretKey, udb.others.get(rx_addr).pk, enc); //Has to be replaced by receiver public keys
    frame["da"] = enc;
    //enc.forEach(ele => frame["da"].push(ele));
	
	let jsonFrame = JSON.stringify(frame);
	soc.send(jsonFrame);
    
    frame["da"] = payload;
    prev_sent_msg = frame;
    	
    let e = helpster.createEvent("mh_messagesent");
    e.detail.msg = frame;
	document.dispatchEvent(e);
}
	
msghandler.sendMetaChange = function(){
	let frame = createFrame("metaInfo", [BROADC_ADDR]);
	frame["da"] = createPayload("metaInfo");
	
	let jsonFrame = JSON.stringify(frame);
	soc.send(jsonFrame);
    
    let e = helpster.createEvent("mh_messagesent");
    
	if(FLAG_TEST_LOCAL){
		frame["na"] = udb.me.na;
		frame["cl"] = udb.me.cl;
		frame["da"]["pl"] = "Meta-Info change";
        
		addMessageToChatBox(frame);
	}
}

msghandler.sendInteraction = function (id){
	let frame = createFrame("interaction", [BROADC_ADDR]);
	frame["da"] = createPayload("interaction", id);
	let jsonFrame = JSON.stringify(frame);
	soc.send(jsonFrame);
}

msghandler.sendPoll = function (msg){
	let e = helpster.createEvent("mh_messagesent");
	let frame = createFrame("poll", [BROADC_ADDR]);
	var pollOptions = document.getElementsByName("poll_option");
	let id = new Date().toISOString();
	var msgObj = {question:msg,
				  answers:{},
				  id:id};
	for (var i = 0; i < pollOptions.length;i++){
		let key = "-opt" + i;
		let value = pollOptions[i].value;
		msgObj.answers[key]=value;
	}
	frame["da"] = createPayload("poll", msgObj);
	console.debug(frame);
	let jsonFrame = JSON.stringify(frame);
	soc.send(jsonFrame);
	e.detail.payload = frame["da"];
	document.dispatchEvent(e);
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
