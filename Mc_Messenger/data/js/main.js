var soc;
function init(){
	soc = new WebSocket('ws://' + window.location.hostname + '/ws');
	soc.onmessage = function(event) {
		document.getElementById("chat_box").innerHTML += "<br>" + (new Date()).toLocaleTimeString() + " " + event.data;
		
		/*
		// Send messages as JSON String is possibly the way to go?!
		var edata = event.data;
		var json_obj = JSON.parse(edata);
		*/
	}
	
	/*
	soc.onopen = function(ev){
		soc.send("T" + Math.round((new Date()).getTime() / 1000));
	}
	*/
	
	
}

function keyPress(event){
	if(event.charCode === 13){
		if(event.shiftKey){
			event.preventDefault();
			sendMessage();
		}
	}
}

function sendMessage(){
	let msg = document.getElementById("msg_field").value;
	document.getElementById("msg_field").value = "";
	if(msg === ""){
		console.log("Empty message, nothing to do...");
	}
	console.log(msg);
	soc.send(msg);
}

function sendName(name){
	console.log(name);
	soc.send(name);
}

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

function showmenu(){
	document.getElementById("frame").classList.toggle("adjustframe");
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

function expand_menu(selector){
	document.getElementById("menu").classList.toggle(selector + "_show");
}