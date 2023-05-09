var FLAG_TEST_LOCAL = false;
const IS_ANGRY = 1;
const IS_HUNGRY = 2;


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
		if(userdb.me.id == e.detail.id) return;
		userdb.updateUser(e.detail.id, { na: "Guest", cl: "white", pk: e.detail.pk });
		addUserToUI(e.detail.id, userdb.others.get(e.detail.id));
	});
	document.addEventListener("mh_dbsync", function(e){
		console.log("DB SYNC TRIGGERED");
		userdb.update(e.detail.db);
		userdb.setHostToken(e.detail.dbTok);
		updateUserlistInUI();
	});
	document.addEventListener("mh_messagerecv", function(e){
		console.log("MESSAGE RECEIVED TRIGGERED");
		console.log(e.detail);
		addMessageToChatBox(e.detail.msg);
	});
	document.addEventListener("mh_messagesent", function(e){
		console.log("MESSAGE SENT TRIGGERED");
		console.log(e.detail);
	});
	document.addEventListener("mh_metachange", function(e){
		console.log("META CHANGE TRIGGERED");
		userdb.updateUser(e.detail.id, e.detail.meta);
		addUserToUI(e.detail.id, e.detail.meta);
	});
	document.addEventListener("mh_tokenchange", function(e){
		console.log("TOKEN CHANGE TRIGGERED");
		userdb.setHostToken(e.detail.dbTok);
	});
	document.addEventListener("mh_cldisconnect", function(e){
		console.log("OPPOSITE CLIENT DISCONNECTED");
		userdb.removeUser(e.detail.cid);
		removeUserFromUI(e.detail.cid);
	});
	
	// UI Element Event Listeners
	document.querySelector("#btn_send").addEventListener("click", function(e) {
		let val = document.querySelector("#msg_input").value;
		console.log("BTN_SEND => " + val);
		msghandler.sendMessage(val);
	});
	
	document.querySelector("#msg_input").addEventListener("keydown", function(event){
		if(event.key == "Enter"){
			event.preventDefault();
			if(event.shiftKey){
				event.target.value = event.target.value + "\n";
			} else {
				if(event.ctrlKey){
					userdb.me.fl |= IS_ANGRY;
				} else {
					userdb.me.fl &= ~IS_ANGRY;
				}
				msghandler.sendMessage(event.target.value);
				event.target.value = "";
			}
		}
	});
	
	document.querySelector("#user_color").addEventListener("change", function(event){
		userdb.me.cl = event.target.value;
		console.log("Color updated: " + userdb.me.cl);
		msghandler.sendMetaChange();
	});
}

function init(){
	userdb.init();
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

function updateUserlistInUI(){
	console.log("UPDATE UL IN FRONTEND");
	console.log(userdb.toString());
	
	let userlist = document.getElementById("userlist");
	userlist.innerHTML = "";
	
	userdb.others.forEach(function(value, key){
		addUserToUI(key, value);
	});
}

function addUserToUI(id, user){
	let entry = document.getElementById("ul"+id);
	let userlist = document.getElementById("userlist");
	
	if(!entry){
		entry = document.createElement("div");
		entry.classList.add("userentry");
		entry.id = "ul"+id;
	}
	
	console.log("USER ADD " + id);
	console.log(user)
	
	if(user["na"] == "Guest") {
		entry.innerHTML = user["na"].fontcolor(user["cl"]) + "." + id;
	} else {
		entry.innerHTML = user["na"].fontcolor(user["cl"])
	}
	entry.addEventListener("click", function(event){
		let input = document.querySelector("#msg_input");
		let input_str = String(input.value);
		
		let id = Number(entry.id.replace(/\D/g, ""));
		let name = userdb.others.get(id).na;
		if(input.value.startsWith("@") == false){
			input.value = "@" + name + " " + input.value;
		}else{
			input.value = input_str.substring(input_str.substring(0,input_str.indexOf(" ")).length + 1);
			input.value = "@" + name + " " + input.value;
		}
	})
	userlist.appendChild(entry);
}

function removeUserFromUI(uid){
	document.getElementById("ul" + uid).remove();
}

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
	} else{
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
			userdb.me.na = name_field.value;
			msghandler.sendMetaChange();
		}
	}
	window.onclick = function(event) {
		if (event.target == background && check_usrname()) {
			background.style.display = "none";
			userdb.me.na = name_field.value;
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
	console.log(obj);
	let sid = obj.sid;
	if(sid === userdb.me.id) {
		// It's a message from myself
		obj["na"] = "You";
		obj["cl"] = userdb.me.cl;
	} else {
		// Get metadata fom the user database
		obj["na"] = userdb.others.get(sid).na;
		obj["cl"] = userdb.others.get(sid).cl;
	}
	
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
