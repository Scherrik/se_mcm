const BROADC_ADDR = 0xFF;


//const db = new Map();
var soc;

const typeMap = new Map();

typeMap.set('srv', 0);
typeMap.set('msg', 2);
typeMap.set('meta', 3);
typeMap.set('poll', 4);
typeMap.set('file', 5);

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
	
	create(type, msgObj = {}){
		let result = {}
		switch(type){
			case "srv":
				// Not implemented yet
				result = this.createServerMessage(msgObj); 
			break;
			case "msg":
				result["pl"] = msgObj;
				result["fl"] = udb.me.flags;
			break;
			case "meta":
				result["na"] = udb.me.name;
				result["cl"] = udb.me.color;
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
												 + obj["name"].fontcolor(obj["color"]) + ": " 
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
		
		let frame = this.createFrame("msg", BROADC_ADDR/* Has to be replaced by real receiver list */);
		frame["da"] = this.create("msg", msg);
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
		let frame = this.createFrame("meta", BROADC_ADDR);
		frame["da"] = this.create("meta");
		
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
	
	extract(json_obj){
		switch (json_obj["typ"]) {
			//Server message on init
			case 0:
				console.log("Received srv message");
				if(json_obj["yid"]){
					udb.me.id = json_obj["yid"];
				}
				//userDB.set(myUser.id, myUser);
				//Foreach entry in incoming frame db create entry in local DB
				
				
				var obj = this.createFrame(-1, typeMap.get("srv"));
				obj["da"] = udb.me.keys.publicKey;
				//udb.me.keys.publicKey.forEach(ele => obj["da"].push(ele));
				console.log(obj);
				console.log(JSON.stringify(obj));
				soc.send(JSON.stringify(obj));
				break;
			// poll result sent from server
			case 1:
				
				break;
			//Chat message
			case 2:
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
					json_obj["name"] = "You";
					json_obj["color"] = udb.me.color;
				} else {
					json_obj["name"] = udb.others.get(sid).name;
					json_obj["color"] = udb.others.get(sid).color;
				}
				this.print(json_obj);
				break;
			//Meta change
			case 3:
				if(json_obj.sid !== udb.me.id) {
					console.log("update value");
					udb.others.set(
							json_obj.sid,
							{ 
							  name: json_obj["da"]["na"], 
							  color: json_obj["da"]["cl"] 
							}
					)
					//udb.others.get(sid).name = json_obj["da"]["na"];
					//udb.others.get(sid).color = json_obj["da"]["cl"];
				}
				break;
			//Poll
			case 4:
				break;
			default:
				console.log("DEFAULT NOTHING TODO...");
				break;
		}
	}
}

const MessageHandle = new MessageHandler();
Object.freeze(MessageHandle);
/*
export default messageHandler; 
*/
