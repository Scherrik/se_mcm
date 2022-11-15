
const FLAG_TEST_LOCAL = true;

const db = new Map();
var soc;

class User {
	constructor(id, pkey, name, color) {
		this.id = id;
		this.pkey = pkey;
		this.name = name;
		this.color = color;
		this.isAngry = false;
	}
	static EmptyInstance(){
		return new User(-1, "", "Default", "black");
	}
	static InstanceWNameAndColor(name, color){
		return new User(-1, "", name, color);
	} 
}
const myUser = User.EmptyInstance();

class MessageHandler{
	constructor(){
	}
	
	create(rcvr, msg, flags){
		return {
			"sender": myUser.name,
			"receiver": rcvr,
			"type": "msg",
			"data":{
				"msg": msg,
				"flags": flags,
				"color": myUser.color,
			}
		};
	}
	
	print(obj){
		let box = document.getElementById("chat_box");
		box.innerHTML += "<p class='msg_block'>" + (new Date()).toLocaleTimeString()  + " " 
												 + obj["sender"].fontcolor(obj["data"]["color"]) + ": " 
												 + obj["data"]["msg"].replace("\n", "<br>")
												 + "</p>";
		
		box.scrollTop = box.scrollHeight;
	
	}
	send(){
		let msg = document.getElementById("msg_input").value;
		
		if(isEmpty(msg)){
			console.log("Empty message, nothing to do...");
			return;
		}
		document.getElementById("msg_input").value = "";
		
		if(FLAG_TEST_LOCAL){
			test_message("[LOCAL]" + msg);
		}
		
		console.log(msg);
		let obj = messageHandler.create("Default", msg, 0);
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
		switch (json_obj["type"]) {
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
	messageHandler.print( messageHandler.create(myUser.name, msg, 0) );
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
