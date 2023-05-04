function initUIElements(){
	viewport_check();
	overlay();
}

function initEventHandler(){
	//TODO
	document.addEventListener("mh_onconnect", function(e){
		console.log("ON CONNECT");
	});
	document.addEventListener("mh_newuser", function(e){
		console.log("USER ADD TRIGGERED");
	});
	document.addEventListener("mh_dbsync", function(e){
		console.log("DB SYNC TRIGGERED");
	});
	document.addEventListener("mh_message", function(e){
		console.log("MESSAGE RECEIVED TRIGGERED");
		console.log(e.detail);
		addMessageToChatBox(e.detail.msg);
	});
	document.addEventListener("mh_metachange", function(e){
		console.log("META CHANGE TRIGGERED");
	});
	document.addEventListener("mh_tokenChange", function(e){
		console.log("TOKEN CHANGE TRIGGERED");
	});
	document.addEventListener("mh_cldisconnect", function(e){
		console.log("OPPOSITE CLIENT DISCONNECTED");
	});
	
	
	// UI Element Event Listeners
	document.querySelector("#btn_send").addEventListener("click", function(e) {
		let val = document.querySelector("#msg_input").value;
		console.log("BTN_SEND => " + val);
		msghandler.sendMessage(val);
	});
}

function init(){
	msghandler.init();
	initUIElements();
	initEventHandler();
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
			msghandler.sendMessage(input.value);
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
	msghandler.sendMetaChange();
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
			msghandler.sendMetaChange();
		}
	}
	window.onclick = function(event) {
		if (event.target == background && check_usrname()) {
			background.style.display = "none";
			userDatabase.me.na = name_field.value;
			msghandler.sendMetaChange();
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


function addMessageToChatBox(obj){
	let box = document.getElementById("chat_box");
	
	//TODO Create a message from HTML template
	
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
