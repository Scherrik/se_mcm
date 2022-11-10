var soc;
const db = new Map();
function init(){
	soc = new WebSocket('ws://' + window.location.hostname + '/ws');
	soc.onmessage = function(event) {

		// Send messages as JSON String is possibly the way to go?!
		var json_obj = JSON.parse(event.data);
		if(json_obj["type"].contains("msg")){
			console.log(json_obj);
			printMessage(json_obj);
		}
		else if(json_obj["type"].contains("db")){
			console.log(json_obj);
			syncdb(json_obj);
		}
	}

	// Default Var
	username = "Default"; // + Userid
	color = "black";
	username_colored = username.fontcolor(color);
	
	/*
	soc.onopen = function(ev){
		soc.send("T" + Math.round((new Date()).getTime() / 1000));
	}
	*/
}

function syncdb(json_obj){
	console.log();
	//Code to sync database
}

function printMessage(json_obj){
	document.getElementById("chat_box").innerHTML += "<br>" + (new Date()).toLocaleTimeString()  + " " + json_obj["sender"] + " " + json_obj["data"]["msg"];
}

function sendMessage(){
	let msg = document.getElementById("msg_input").value;
	document.getElementById("msg_input").value = "";
	if(msg === ""){
		console.log("Empty message, nothing to do...");
		return;
	}
	console.log(msg);

	//define variables
	let obj ={
		"sender":username,
		"receiver":receiver,
		"data":{
			"msg":msg,
			"flags":flags,
			"color":color,
		}
	}
	console.log(obj);
	soc.send(JSON.stringify(obj));
}

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
	if(event.key == "Enter" && event.shiftKey){
		event.preventDefault();
		input.value = input.value + "\r\n";
	}
	else if(event.keyCode == 13){
			event.preventDefault();
			test_message();
	}
});

function test_message(){
	var msg = document.getElementById("msg_input").value;
	console.log(msg);
	msg = String(msg.replaceAll("\n","<br>")).fontcolor(color);
	document.getElementById("msg_input").value = "";
	document.getElementById("chat_box").innerHTML += "<br>" + (new Date()).toLocaleTimeString() + " " + username_colored + ": " + msg;
}

//color selector + update color
var color = document.getElementById("user_color");
color.addEventListener("change", function(event){
	color = event.target.value;
	console.log("Color updated: " + color);
	username_colored = username.fontcolor(color);
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