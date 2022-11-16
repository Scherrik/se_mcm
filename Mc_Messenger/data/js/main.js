
const FLAG_TEST_LOCAL = true;

const db = new Map();
var soc;

class User {
	constructor(id=-1, pkey="", name="Default", color="black") {
		this.id = id;
		this.keys = nacl.box.keyPair();
		this.name = name;
		this.color = color;
		this.flags = 0;
	}
}
const myUser = new User();

const typeMap = new Map();

typeMap.set('srv', 0);
typeMap.set('msg', 2);
typeMap.set('poll', 3);
typeMap.set('file', 4);

class MessageHandler{
	constructor(){
	}
	
	
	/* Data API Definition:
	 * 	Message:
	 * 		{
	 * 			"sid": sid,			// sender (id) 
	 * 			"rid": [rid,...],	// receiver list (ids)
	 * 			"typ": 0,			//type 0 = server(not encrypted), type 2 = message(encrypted), type 3 = poll(encrypted)
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
	 * 			}, 	//data type message OR
	 * 			//Data Encrypted
	 * 			"da": {
	 * 				"qu": "...?",
	 * 				"an": ["...", "...", ...]
	 * 
	 * 			} 	//data type poll
	 * 		}
	 * */
	createFrame(receiver_list, type){
		return {
			"sid": myUser.name,
			"rid": receiver_list,
			"typ": typeMap.get(type),			//type 0 = server(not encrypted), type 2 = message(encrypted), type 3 = poll(encrypted)
			"da": []
		};
	}
	
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
	
	
	create(msgObj, type){
		let result = {}
		switch(type){
			case "srv":
				return this.createServerMessage(msgObj); 
			case "msg":
				result["pl"] = msgObj; 
				result["fl"] = myUser.flags;
				result["cl"] = myUser.color;
			break;
			case "poll":
				result = this.createPoll(msgObj); 
			break;
			default:
				result = "WRONG TYPE " + type;
				console.log(result["da"]);
			break;
		}
		return result;
	}
	
	encryptPayload(msg){
		var secretKey  = myUser.keys.secretKey;
		var publicKey  = myUser.keys.publicKey;
		let nonce = new Uint8Array(nacl.box.nonceLength);
		let message = nacl.util.decodeUTF8(msg);
		let result = nacl.box(message, nonce, publicKey, secretKey);
		return result;
	}
	
	decryptPayload(obj){
		let nonce = new Uint8Array(nacl.box.nonceLength);
		let ui8a = Uint8Array.from(obj["da"]);
		var secretKey  = myUser.keys.secretKey;
		var publicKey  = myUser.keys.publicKey;
		
		// TODO get public key either from database or from the initial message
		
		let decPayload = nacl.util.encodeUTF8(nacl.box.open(ui8a, nonce, publicKey, secretKey))
		obj["da"] = JSON.parse(decPayload);
	}
	
	print(obj){
		console.debug("PRINT CALL");
		console.log(obj);
		let box = document.getElementById("chat_box");
		box.innerHTML += "<p class='msg_block'>" + (new Date()).toLocaleTimeString()  + " " 
												 + obj["sid"].fontcolor(obj["da"]["clr"]) + ": " 
												 + obj["da"]["pl"].replace("\n", "<br>")
												 + "</p>";
		
		box.scrollTop = box.scrollHeight;
	}
	
	send(){
		console.debug("SEND CALL");
		let msg = document.getElementById("msg_input").value;
		
		if(isEmpty(msg)){
			console.log("Empty message, nothing to do...");
			return;
		}
		document.getElementById("msg_input").value = "";
		
		console.debug("MSG 1");
		console.log(msg);
		console.debug("MSG 2");
		console.log(msg);
		let frame = messageHandler.createFrame("Default", "msg");
		let enc = JSON.stringify(messageHandler.create(msg, "msg"));
		console.log(typeof frame["da"]);
		enc = this.encryptPayload(enc);
		console.log(enc);
		enc.forEach(ele => frame["da"].push(ele));
		//frame["da"].push(enc);
		console.log(enc);
		console.log(frame["da"]);
		let jsonFrame = JSON.stringify(frame);
		console.log(jsonFrame);
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
		console.debug("EXTRACT CALL");
		console.log(json_obj["typ"]);
		switch (json_obj["typ"]) {
			//Server message
			case 0:
				
			break;
			//Chat message
			case 2:
				this.decryptPayload(json_obj);
				this.print(json_obj);
			break;
			//Poll
			case 3:
			break;
			default:
			console.log("DEFAULT NOTHING TODO...");
			break;
		}
	}
}
const messageHandler = new MessageHandler();
Object.freeze(messageHandler);
//export default messageHandler;

function isEmpty(str){
	return (!str || str.trim().length === 0);
}

function init(){
	soc = new WebSocket('ws://' + window.location.hostname + '/ws');
	soc.onmessage = function(event) {
		console.debug("MSG: " + event.data);
		// Send messages as JSON String is possibly the way to go?! Yes it is!
		var json_obj = JSON.parse(event.data);
		messageHandler.extract(json_obj);		
	}
}

// Do we need this function?
function sendName(name){
	console.log(name);
	soc.send(name);
}

function showmenu(){
	document.getElementById("frame").classList.toggle("adjustframe");
}
function expand_menu(selector){
	document.getElementById("menu").classList.toggle(selector + "_show");
}

function adduser(){
	let userlist = document.getElementById("userlist");
	let username = document.getElementById("testuser").value;
	if (username != ""){
		let entry = document.createElement("div");
		entry.classList.add("userentry");
		entry.id = username;
		entry.textContent = username;
		entry.addEventListener("click", function(event){
			let input_str = String(input.value);
			if(input.value.startsWith("@") == false){
				input.value = "@" + entry.id + " " + input.value;
			}else{
				input.value = input_str.substring(input_str.substring(0,input_str.indexOf(" ")).length + 1);
				input.value = "@" + entry.id + " " + input.value;
			}
		})
		userlist.appendChild(entry);
	}
}

function removeuser(){
	let username = document.getElementById("testuser").value;
	let entry = document.getElementById(username);
	entry.remove();
}

var input = document.getElementById("msg_input");
var wcount = document.getElementById("charcount");
input.addEventListener("keydown", function(event){
	wcount.innerHTML = String(input.value.length).padStart(3, '0') + "/500";
	if(event.key == "Enter"){
		event.preventDefault();
		if(event.shiftKey){
			input.value = input.value + "\n";
		} else {
			messageHandler.send();
		}
	}
});

function test_message(msg){	
	messageHandler.print( messageHandler.create(myUser.name, msg, "msg") );
}

//color selector + update color
var colorPicker = document.getElementById("user_color");
colorPicker.addEventListener("change", function(event){
	myUser.color = event.target.value;
	console.log("Color updated: " + myUser.color);
});

//not in use
function darkmode(){
	document.body.classList.toggle("dark-mode");
	var test = document.querySelectorAll(".tile");
	test.forEach(x => x.classList.toggle("dark-mode"));
}
function angrymode(){
	document.body.classList.toggle("angrymode");
	document.getElementById("chat_box").classList.toggle("angrymode");
	document.getElementById("msg_input").classList.toggle("angrymode");
	document.getElementById("frame").classList.toggle("angryshake");
}
