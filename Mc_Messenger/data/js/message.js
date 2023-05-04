const BROADC_ADDR = 0xFFFF;


//const db = new Map();
var soc;

const typeMap = new Map();

// 
typeMap.set('hello-client', 1);
typeMap.set('hello-world', 2);
typeMap.set('db-sync', 3);
//typeMap.set('pk-exchange', 3);
typeMap.set('server-poll', 4);
typeMap.set('token-handover', 5);
typeMap.set('byebye-client', 16);
typeMap.set('message', 128);
typeMap.set('meta-info', 129);
typeMap.set('poll', 130);
typeMap.set('file', 131);

function typeToString(id){
	for (const [key, value] of typeMap) {
		if(value == id) return key;
	}
	return "NO TYPE FOUND";
	//return [...typeMap.values()].find(([key,val]) => id == value)[0];
}

function bytesToString(bytes) {
    var chars = [];
    for(var i = 0, n = bytes.length; i < n;) {
        chars.push(((bytes[i++] & 0xff) << 8) | (bytes[i++] & 0xff));
    }
    return String.fromCharCode.apply(null, chars);
}

// https://codereview.stackexchange.com/a/3589/75693
function stringToBytes(str) {
    var bytes = [];
    for(var i = 0, n = str.length; i < n; i++) {
        var char = str.charCodeAt(i);
        bytes.push(char >>> 8, char & 0xFF);
    }
    return bytes;
}

class MessageHandler{
	constructor(){
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
	createFrame(type, receiver_list){
		// Create the header of a message, which contains:
		//   - the clients id itself (sid = sender id) 
		//   - the receiver id (or multiple receiver ids) 
		//   - the type of message 
		//   - a data field with the payload
		return {
			"sid": userDatabase.me.id,
			"rid": receiver_list,
			"typ": typeMap.get(type),			//type 0 = server(not encrypted), type 2 = message(encrypted), type 3 = poll(encrypted)
			"da": []
		};
	}
	
	createPayload(type, msgObj = {}){
		// In dependency of the type of a message,
		// different named fields will be used as the message payload
		let result = {}
		console.log("CREATE " + type + " PAYLOAD");
		switch(type){
			// "message consists of: "pl" = payload, "fl" = flags (angry, ...)
			case "message":
				result["pl"] = msgObj;
				result["fl"] = userDatabase.me.fl;
			break;
			// "meta-info" consists of: "na" = name, "cl" = color
			case "meta-info":
				result["na"] = userDatabase.me.na;
				result["cl"] = userDatabase.me.cl;
			break;
			// "server-poll" consists of: TODO >> NOT IMPLEMENTED YET
			case "server-poll":
				// Not implemented yet
				result = ""; 
			break;
			// "db-sync" consists of: "db" = the user database, see UserDatabase.toObject()
			case "db-sync":
				result["db"] = userDatabase.toObject(); 
			break;
			case "hello-world":
				// "hello-world" consists of: "pk" = public key of the client
				result["pk"] = bytesToString(userDatabase.me.keys.publicKey); 
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
	
	processIncomingMessage(json_str){
		// The incoming message will be interpreted as a JSON obj
		console.log(json_str);
		let json_obj = JSON.parse(json_str);
		// On success the client extracts the header and interprets the message depending on the type
		
		let type = typeToString(json_obj["typ"]);
		console.log("RECEIVED " + type + " Message");
		switch (type) {
			//Server message on init, properties: "yid"=ClientID(yourID), "dbs"=User database size, "
			case "hello-client":
				userDatabase.me.id = json_obj["yid"];
				let db_size = json_obj["dbs"];
				var obj = {}
				if(db_size == 0){
					// Nobody is online, so the client is the host of the session
					userDatabase.setHostToken(true);
				} else {
					// Send a broadcast message to say hello to all other clients
					obj = this.createFrame("hello-world", [BROADC_ADDR]);
					obj["da"] = this.createPayload("hello-world");
					console.log(JSON.stringify(obj));
					soc.send(JSON.stringify(obj));
				}
				break;
			case "hello-world":
				// If the client is the sender of a hello-world message, it can ignore it
				if(json_obj["sid"] == userDatabase.me.id) return;
				// Otherwise if the client is the host of the session, 
				// it has to respond with a "hello_world" message 
				// and after a small amount of time respond with a "db-sync" message 
				// which contains the user database
				if(userDatabase.dbHostToken){
					//Preparation of "hello world" and "db-sync" messages"
					console.log("got token, send hello_world response and db");
					var obj = this.createFrame("hello-world", [json_obj["sid"]]);
					obj["da"] = this.createPayload("hello-world");
					soc.send(JSON.stringify(obj));
					obj = this.createFrame("db-sync", [json_obj["sid"]]);
					obj["da"] = this.createPayload("db-sync");
					var json = JSON.stringify(obj)
					console.log(json);
					setTimeout(function(){ 
						soc.send(json);
						// After sending the "db-sync" message, the newly connected client becomes the host of the session, so remove the token
						console.log("Removed db host token");
						userDatabase.dbHostToken = false;
						console.log("done");
					}, 250);
				}
				// New dummy client (with the right id) will be added to the user database
				console.log("add new user to db");
				userDatabase.updateUser(json_obj["sid"], { na: "Default", cl: "black", pk: stringToBytes(json_obj["da"]["pk"])})
				break;
			case "db-sync":
				// when a new client connects to mcm, he gets this message
				userDatabase.dbHostToken = true;
				userDatabase.update(json_obj["da"]["db"]);
				console.log("Now I'm new db host provider");
				break;
			case "token-handover":
				// Needed if the old host was disconnected, send by server automatically
				userDatabase.dbHostToken = true;
				break;
			case "byebye-client":
				// Notification for all other clients about a disconnectiing client
				userDatabase.removeUser(json_obj["cid"]);
				break;
			//Chat message
			case "message":
				//this.decryptPayload(json_obj);
				// Check if angry flag is set, and if so start angry mode for 5seconds
				if(json_obj["da"]["fl"] & IS_ANGRY){
					angrymode();
					setTimeout(function(){ angrymode(); }, 5000);
				}
				// Add color and name to the json object before it will be added to the chat box
				let sid = json_obj.sid;
				if(sid === userDatabase.me.id) {
					// It's a message from myself
					json_obj["na"] = "You";
					json_obj["cl"] = userDatabase.me.cl;
				} else {
					// Get metadata fom the user database
					json_obj["na"] = userDatabase.others.get(sid).na;
					json_obj["cl"] = userDatabase.others.get(sid).cl;
				}
				this.addMessageToChatBox(json_obj);
				break;
			//Meta change
			case "meta-info":
				// A name or color change was recognized and will be written to the user database
				if(json_obj.sid !== userDatabase.me.id) {
					userDatabase.updateUser(
						json_obj.sid,
						{
						  na: json_obj["da"]["na"], 
						  cl: json_obj["da"]["cl"] 
						}
					)
				}
				break;
			//Poll
			case 130:
				break;
			default:
				console.log("DEFAULT NOTHING TODO...");
				break;
		}
	}
	
	encryptPayload(secretKey, rcvrPubKey, msg){
		let nonce = new Uint8Array(nacl.box.nonceLength);
		let message = nacl.util.decodeUTF8(msg);
		let result = nacl.box(message, nonce, rcvrPubKey, secretKey);
		return result;
	}
	
	decryptPayload(secretKey, sndrPubKey, msgUint8_Array){
		let nonce = new Uint8Array(nacl.box.nonceLength);
		let ui8a = Uint8Array.from(msgUint8_Array);
		let obox = nacl.box.open(ui8a, nonce, sndrPubKey, secretKey);
		return nacl.util.encodeUTF8(obox);
	}
	
	addMessageToChatBox(obj){
		let box = document.getElementById("chat_box");
		
		let msg_block = document.createElement("div");
		let msg_head = document.createElement("div");
		let head_name = document.createElement("div");
		let head_time = document.createElement("div");
		let payload = document.createElement("div");
		head_name.classList.add("msg_head_name");
		head_name.style.color = obj["cl"];
		head_name.innerText = obj["na"];
		head_time.classList.add("msg_head_time");
		head_time.innerHTML = (new Date()).toLocaleTimeString().fontsize("0.5em");
		msg_block.classList.add("msg_block");
		payload.innerText = obj["da"]["pl"].replace("\n", "<br>");
		msg_block.appendChild(head_name);
		msg_block.appendChild(head_time);
		msg_block.appendChild(payload);	
		box.appendChild(msg_block);
		box.scrollTop = box.scrollHeight;
	}
	
	sendMessage(){
		console.log("Send message");
		let msg = document.getElementById("msg_input").value;
		
		if(isEmpty(msg)){
			console.log("Empty message, nothing to do...");
			return;
		}
		document.getElementById("msg_input").value = "";
		document.getElementById("charcount").innerHTML = "000/500";
		
		/*
		 * TODO Extract name from message and determine id(s) from belonging user 
		 */ 
		
		let frame = this.createFrame("message", [BROADC_ADDR]/* Has to be replaced by real receiver list */);
		frame["da"] = this.createPayload("message", msg);
		/* Encryption part
		let enc = JSON.stringify(messageHandler.create(msg, "msg"));
		enc = this.encryptPayload(enc, myUser.keys.publicKey ); //Has to be replaced by receiver public keys
		enc.forEach(ele => frame["da"].push(ele));
		*/
		let jsonFrame = JSON.stringify(frame);
		soc.send(jsonFrame);
		if(FLAG_TEST_LOCAL){
			frame["na"] = userDatabase.me.na;
			frame["cl"] = userDatabase.me.cl;
			this.addMessageToChatBox(frame);
		}
	}
	
	sendMetaChange(){
		let frame = this.createFrame("meta-info", [BROADC_ADDR]);
		frame["da"] = this.createPayload("meta-info");
		
		let jsonFrame = JSON.stringify(frame);
		soc.send(jsonFrame);
		if(FLAG_TEST_LOCAL){
			frame["na"] = userDatabase.me.na;
			frame["cl"] = userDatabase.me.cl;
			frame["da"]["pl"] = "Meta-Info change";
			this.addMessageToChatBox(frame);
		}
	}
		
	syncDB(obj){
		console.log();
		//Code to sync database
	}
	
}

const MessageHandle = new MessageHandler();
Object.freeze(MessageHandle);
/*
export default messageHandler; 
*/
