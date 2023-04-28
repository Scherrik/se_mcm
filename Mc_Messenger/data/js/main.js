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
	viewport_check();
	overlay();
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
		
		let id = Number(entry.id.replace(/\D/g, ""));
		let name = userDatabase.others.get(id).na;
		if(input.value.startsWith("@") == false){
			input.value = "@" + name + " " + input.value;
		}else{
			input.value = input_str.substring(input_str.substring(0,input_str.indexOf(" ")).length + 1);
			input.value = "@" + name + " " + input.value;
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
	const name_field = document.getElementById("user_name");
	const name = String(document.getElementById("user_name").value);
	if(name_field.classList.contains("shake-horizontal")){
		name_field.classList.remove("shake-horizontal");
		console.log("removed class");
	}
	if(name.includes(" ") || name == ""){
		name_field.classList.add("shake-horizontal");
		return false;
	}else{
		return true;
	}
}
function overlay() {
	var background = document.getElementById("pubg");
	background.style.display = "flex";
	const start_button = document.getElementById("start_button");
	const name_field = document.getElementById("user_name");
	start_button.onclick = function (){
		if(check_usrname()){
			background.style.display = "none";
			userDatabase.me.na = name_field.value;
			MessageHandle.sendMetaChange();
		}
	}
	window.onclick = function(event) {
		if (event.target == background && check_usrname()) {
			background.style.display = "none";
			userDatabase.me.na = name_field.value;
			MessageHandle.sendMetaChange();
		}
	}
}

function viewport_check() {
	console.log("Viewport_check")
	let mobile_viewport = window.matchMedia("(max-width: 500px)");
	let pc_viewport = window.matchMedia("(min-width: 501px");
	function mobile_viewport_change(){
		if (mobile_viewport.matches) {
			console.log("mobile");
			var fragment = document.createDocumentFragment();
			fragment.appendChild(document.getElementById("userlist"));
			document.getElementById("menu_files_content").appendChild(fragment);
		}
	}
	mobile_viewport.addListener(mobile_viewport_change);

	function pc_viewport_change(){
		if (pc_viewport.matches) {
			console.log("pc");
			var fragment = document.createDocumentFragment();
			fragment.appendChild(document.getElementById("userlist"));
			document.getElementById("userlist_parent").appendChild(fragment);
			expand_menu("menu_files");
		}
	}
	pc_viewport.addListener(pc_viewport_change);

	mobile_viewport_change();
	pc_viewport_change();
}