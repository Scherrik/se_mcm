// Helper function to determine if a string is empty
function isEmpty(str){
	return (!str || str.trim().length === 0);
}

// Using an async function to handle incoming messages
async function extract(blob){
	(blob.text().then(
		value => MessageHandle.processIncomingMessage(value)));
}

// Initialize websocket connection and its handlers
function init(){
	const socketProtocol = (window.location.protocol === 'https:' ? 'wss:' : 'ws:')
    const port = 8080;
	soc = new WebSocket(`${socketProtocol}//${window.location.hostname}:${port}/ws`);
	soc.onmessage = function(event) {
		console.log(event.data.arrayBuffer());
		extract(event.data);
	}
	soc.onerror = function(event){
		FLAG_TEST_LOCAL = true;	
	}
	soc.ondisconnect = function(event){
		FLAG_TEST_LOCAL = true;	
	}
	//userDatabase.getNameList().forEach(adduser);
	//overlay();
}

function showmenu(){
	document.getElementById("frame").classList.toggle("adjustframe");
	document.getElementById("menu_line1").classList.toggle("l1");
	document.getElementById("menu_line3").classList.toggle("l3");
	document.getElementById("menu_line2").classList.toggle("l2");
}
function expand_menu(selector){
	document.getElementById("menu").classList.toggle(selector + "_show");
}
//used for manual add/remove button
function addTestUser(){
	let username = document.getElementById("testuser").value;
	adduser(username);
}

function updateUserlist(){
	console.log("UPDATE UL IN FRONTEND");
	console.log(userDatabase.toString());
	
	let userlist = document.getElementById("userlist");
	userlist.innerHTML = "";
	
	userDatabase.others.forEach(function(value, key){
		adduser(key, value);
	});
}

function adduser(id, user){
	let entry = document.getElementById("ul"+id);
	if(entry){
		if(user["na"] == "Default") {
			entry.innerHTML = user["na"].fontcolor(user["cl"]) + "." + id;
		} else {
			entry.innerHTML = user["na"].fontcolor(user["cl"])
		}
		return;
	}
	
	console.log("USER ADD " + id);
	console.log(user)
	let userlist = document.getElementById("userlist");
	
	entry = document.createElement("div");
	entry.classList.add("userentry");
	entry.id = "ul"+id;
	if(user["na"] == "Default") {
		entry.innerHTML = user["na"].fontcolor(user["cl"]) + "." + id;
	} else {
		entry.innerHTML = user["na"].fontcolor(user["cl"])
	}
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

function removeuser(uid){
	document.getElementById("ul" + uid).remove();
}

var input = document.getElementById("msg_input");
var wcount = document.getElementById("charcount");
input.addEventListener("keydown", function(event){
	if(event.key == "Enter"){
		event.preventDefault();
		if(event.shiftKey){
			input.value = input.value + "\n";
		} else {
			if(event.ctrlKey){
				userDatabase.me.fl |= IS_ANGRY;
			} else {
				userDatabase.me.fl &= ~IS_ANGRY;
			}
			MessageHandle.sendMessage();
		}
	}
	console.log(event.target);
	wcount.innerHTML = String(event.target.value.length).padStart(3, '0') + "/500";
});

//color selector + update color
var colorPicker = document.getElementById("user_color");
colorPicker.addEventListener("change", function(event){
	userDatabase.me.cl = event.target.value;
	console.log("Color updated: " + userDatabase.me.cl);
	MessageHandle.sendMetaChange();
});

function angrymode(){
	document.body.classList.toggle("angrymode");
	document.getElementById("chat_box").classList.toggle("angrymode");
	document.getElementById("msg_input").classList.toggle("angrymode");
	document.getElementById("frame").classList.toggle("angryshake");
}

function check_usrname(){
	let name = String(document.getElementById("login_name").value);
	if(name.includes(" ") == true){console.log("Leerzeichen")};
}
function overlay() {
	var background = document.getElementById("pubg");
	background.style.display = "block";

	window.onclick = function(event) {
		if (event.target == background) {
			background.style.display = "none";
		}
	}
}
