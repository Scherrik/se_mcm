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
		return {
			"sid": udb.me.id,
			"rid": receiver_list,
			"typ": typeMap.get(type),			//type 0 = server(not encrypted), type 2 = message(encrypted), type 3 = poll(encrypted)
			"da": []
		};
	}
	/*
	createServerMessage(msg){
		switch(msg["msg_type"]){
			case "poll":
			return msg["timer"];
			case "pkey":
			return { "pk": myUser.keys.publicKey }
			default:
			return "DEFAULT";
		}
	}
	*/
	
	createPayload(type, msgObj = {}){
		let result = {}
		console.log("CREATE " + type + " Message");
		switch(type){
			case "message":
				result["pl"] = msgObj;
				result["fl"] = udb.me.fl;
			break;
			case "meta-info":
				result["na"] = udb.me.na;
				result["cl"] = udb.me.cl;
			break;
			case "server-poll":
				// Not implemented yet
				result = this.createServerMessage(msgObj); 
			break;
			case "db-sync":
				result["db"] = udb.toObject(); 
			break;
			case "hello-world":
				result["pk"] = bytesToString(udb.me.keys.publicKey); 
			break;
			case "poll":
				result["qu"] = msgObj.question;
				result["an"] = msgObj.answers;
			break;
			default:
				result = "WRONG TYPE " + type;
				console.error(result);
			break;
		}
		return result;
	}
	
	processIncomingMessage(json_obj){
		
		let type = typeToString(json_obj["typ"]);
		console.log("RECEIVED " + type + " Message");
		switch (type) {
			//Server message on init
			case "hello-client":
				console.log("hello_client received");
				udb.me.id = json_obj["yid"];
				let db_size = json_obj["dbs"];
				var obj = {}
				if(db_size == 0){
					udb.setHostToken(true);
				} else {
					// send hello_world
					console.log("send hello_world");
					obj = this.createFrame("hello-world", [BROADC_ADDR]);
					obj["da"] = this.createPayload("hello-world");
					console.log(JSON.stringify(obj));
					soc.send(JSON.stringify(obj));	
				}
				
				return;
								
				/*
				console.log("Received srv message");
				if(json_obj["yid"]){
					udb.me.id = json_obj["yid"];
				}
				// counter part client info: id, pkey
				if(json_obj["cpa"]){
					udb.updateUser(json_obj["cpa"]["id"], 
									{ "pkey": json_obj["cpa"]["pk"] }
								);
				} else {
					console.log("No other participants here, you're first!");
					// TODO Create broadcast keypair (for encryption)
				}
				
				
				// Send public keys
				var obj = this.createFrame("db_init", -1);
				obj["da"] = udb.me.keys.publicKey;
				console.log(obj);
				console.log(JSON.stringify(obj));
				soc.send(JSON.stringify(obj));
				*/ 
				break;
			// user database
			case "hello-world":
				if(json_obj["sid"] == udb.me.id) return;
				console.log("hello-world received");
				if(udb.dbHostToken){
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
						console.log("Removed db host token");
						udb.dbHostToken = false;
						console.log("done");
					}, 250);
				}
				//setTimeout(function(){ 
					console.log("add new user to db");
					console.log(stringToBytes(json_obj["da"]["pk"]));
					udb.updateUser(json_obj["sid"], { na: "Default." + json_obj["sid"], cl: "black", pk: stringToBytes(json_obj["da"]["pk"])})
				//}, 300);
				break;
			case "db-sync":
				udb.dbHostToken = true;
				udb.updateDB(json_obj["da"]["db"]);
				console.log("Now I'm new db host provider");
				break;
			//Chat message
			case "message":
				//this.decryptPayload(json_obj);
				//console.log(json_obj["da"]);
				if(json_obj["da"]["fl"] & IS_ANGRY){
					angrymode();
					setTimeout(function(){ angrymode(); }, 5000);
				}
				console.log(json_obj);
				console.log(udb.others);
				let sid = json_obj.sid;
				if(sid === udb.me.id) {
					json_obj["na"] = "You";
					json_obj["cl"] = udb.me.cl;
				} else {
					json_obj["na"] = udb.others.get(sid).na;
					json_obj["cl"] = udb.others.get(sid).cl;
				}
				this.print(json_obj);
				break;
			//Meta change
			case "meta-info":
				if(json_obj.sid !== udb.me.id) {
					udb.updateUser(
							json_obj.sid,
							{
							  na: json_obj["da"]["na"], 
							  cl: json_obj["da"]["cl"] 
							}
					)
					//udb.others.get(sid).name = json_obj["da"]["na"];
					//udb.others.get(sid).color = json_obj["da"]["cl"];
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
	encryptPayload(msg, rcvrPkey){
		var secretKey  = udb.me.keys.secretKey;
		// TODO get counter part public key either from database or from the initial message
		//var publicKey  = myUser.keys.publicKey;
		let nonce = new Uint8Array(nacl.box.nonceLength);
		let message = nacl.util.decodeUTF8(msg);
		let result = nacl.box(message, nonce, rcvrPkey, secretKey);
		return result;
	}
	
	decryptPayload(obj){
		let nonce = new Uint8Array(nacl.box.nonceLength);
		let ui8a = Uint8Array.from(obj["da"]);
		var secretKey  = udb.me.keys.secretKey;
		
		// TODO get counter part public key either from database or from the initial message
		var publicKey  = udb.me.keys.publicKey;
		let obox = nacl.box.open(ui8a, nonce, publicKey, secretKey);
		console.log(obox);
		let decPayload = nacl.util.encodeUTF8(obox);
		obj["da"] = JSON.parse(decPayload);
	}
	
	encryptString(str, pkey){
		/* TODO return encrypted message,
		 * to encrypt use private key udb.me.keys.secretKey
		 * */
	}
	
	decryptString(enc_str, pkey){
		/* TODO return decrypted message
		 * to decrypt use own private key udb.me.keys.secretKey
		 */
	}
	
	print(obj){
		//console.log(userDB.get(obj.sid));
		
		let box = document.getElementById("chat_box");
		/*
		box.innerHTML += "<p class='msg_block'>" + (new Date()).toLocaleTimeString()  + " " 
												 + userDB.get(obj.sid).name.fontcolor(obj["da"]["cl"]) + ": " 
												 + obj["da"]["pl"].replace("\n", "<br>")
												 + "</p>";*/
		
		box.innerHTML += "<p class='msg_block'>" + (new Date()).toLocaleTimeString()  + " " 
												 + obj["na"].fontcolor(obj["cl"]) + ": " 
												 + obj["da"]["pl"].replace("\n", "<br>")
												 + "</p>";
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
			this.extract(JSON.parse(jsonFrame));
		}
	}
	
	sendMetaChange(){
		let frame = this.createFrame("meta-info", [BROADC_ADDR]);
		frame["da"] = this.createPayload("meta-info");
		
		let jsonFrame = JSON.stringify(frame);
		soc.send(jsonFrame);
		if(FLAG_TEST_LOCAL){
			this.extract(JSON.parse(jsonFrame));
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
