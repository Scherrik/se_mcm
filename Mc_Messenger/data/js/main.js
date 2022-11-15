
const FLAG_TEST_LOCAL = true;

const db = new Map();
var soc;

class User {
	constructor(id=-1, pkey="", name="Default", color="black") {
		this.id = id;
		this.keys = nacl.box.keyPair();
		this.name = name;
		this.color = color;
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
	 * 			"sid": sid,			// sender
	 * 			"rid": [rid,...],	// receiver list
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
	createHeader(receiver_list, type){
		return {
			"sid": myUser.name,
			"rid": receiver_list,
			"typ": 0,			//type 0 = server(not encrypted), type 2 = message(encrypted), type 3 = poll(encrypted)
			"da": {}
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
	createEncryptedMessage(msg){
		return "SECRET";
	}
	createMessage(msg){
		return {
			"pl": msg["payload"],			//payload
			"fl": msg["flags"],				//client flags (sender)
			"cl": myUser.color				//client name color (sender)
		}
	}
	createPoll(msg){
		return {
			"qu": msg["question"],
			"an": msg["answers"]
		}
	}
	
	
	create(receiver_list, msgObj, type){
		this.encryptPayload(msgObj);
		let result = this.createHeader(receiver_list, type);
		switch(type){
			case "srv":
				result["da"] = this.createServerMessage(msgObj); 
			break;
			case "msg":
				result["da"]["pl"] = msgObj; 
				result["da"]["fl"] = 0;
				result["da"]["cl"] = myUser.color;
			break;
			case "poll":
				result["da"] = this.createPoll(msgObj); 
			break;
			default:
				result["da"] = "WRONG TYPE " + type;
				console.log(result["da"]);
			break;
		}
		return result;
	}
	
	encryptPayload(msg){
		this.encryptPayload(msgObj);
		console.log(myUser.keys);
		var secretKey  = myUser.keys.secretKey;
		var publicKey  = myUser.keys.publicKey;
		let nonce = new Uint8Array(nacl.box.nonceLength);
		console.log(typeof msg);
		let message = nacl.util.decodeUTF8(msg);
		console.log(nacl.box(message, nonce, publicKey, secretKey))
		return;
	}
	
	print(obj){
		console.log(obj);
		let box = document.getElementById("chat_box");
		box.innerHTML += "<p class='msg_block'>" + (new Date()).toLocaleTimeString()  + " " 
												 + obj["sid"].fontcolor(obj["da"]["clr"]) + ": " 
												 + obj["da"]["pl"].replace("\n", "<br>")
												 + "</p>";
		
		box.scrollTop = box.scrollHeight;
	
	}
	
	send(){
		let value = document.getElementById("msg_input").value;
		const msg = {
			"pl": value,
			"fl": myUser.flags,
			"cl": myUser.color
		};
		if(isEmpty(msg["pl"])){
			console.log("Empty message, nothing to do...");
			return;
		}
		document.getElementById("msg_input").value = "";
		
		console.log(msg);
		if(FLAG_TEST_LOCAL){
			test_message(msg);
		}
		console.log(msg);
		let obj = messageHandler.create("Default", msg, "msg");
		console.log(obj);
		soc.send(JSON.stringify(obj));
	}
		
	syncDB(obj){
	console.log();
	//Code to sync database
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
		switch (json_obj["typ"]) {
			case "db":
				console.log(json_obj);
				messageHandler.syncDB(json_obj);
			break;
			case "msg":
				console.log(json_obj);
				messageHandler.print(json_obj);
			break;
			case "poll":
			break;
			default:
			break;
		}
		
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
	var userlist = document.getElementById("userlist");
	var username = document.getElementById("testuser").value;
	if (username != ""){
		var entry = document.createElement("div");
		entry.classList.add("userentry");
		entry.id = username;
		entry.textContent = username;
		userlist.appendChild(entry);
	}
	
}
function removeuser(){
	var username = document.getElementById("testuser").value;
	var entry = document.getElementById(username);
	entry.remove();
}

var input = document.getElementById("msg_input");
input.addEventListener("keypress", function(event){
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
	messageHandler.print( messageHandler.create(myUser.name, msg["pl"], "msg") );
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
	document.body.classList.toggle("angry-mode");
	var test = document.querySelectorAll(".tile");
	test.forEach(x => x.classList.toggle("angry-mode"));
}
