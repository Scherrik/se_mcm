var FLAG_TEST_LOCAL = false;
const IS_ANGRY = 1;
const IS_HUNGRY = 2;

function initUIElements(){
	viewport_check();
	overlay("login");
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
	document.addEventListener("mh_interactionsent", function(e){
		console.log("INTERACTION SENT TRIGGERED");
		console.log(e.detail);
	});
	document.addEventListener("mh_interactionrecv", function(e){
		console.log("INTERACTION RECEIVED TRIGGERED");
		console.log(e.detail);
		interactionHandler(e.detail.msg);
	});
	
	// UI Element Event Listeners
	document.querySelector("#msgbtn_send").addEventListener("click", function(e) {
		let val = document.querySelector("#msg_input").value;
		console.log("BTN_SEND => " + val);
		msghandler.sendMessage(val);
	});
	
	document.querySelector("#msgbtn_angry").addEventListener("click", function(e) {
		let val = document.querySelector("#msg_input").value;
		console.log("BTN_SEND => " + val);
		userdb.me.fl |= IS_ANGRY;
		msghandler.sendMessage(val);
		userdb.me.fl &= ~IS_ANGRY;
	});

	document.querySelector("#add_poll_option").addEventListener("click", function (e){
		console.log("Poll option added to UI")
		addPollOption();
	});

	document.querySelector("#send_poll").addEventListener("click", function (e){
		let val = document.querySelector("#poll_question_field").value;
		console.log("POLL SENT TRIGGERED")
		msghandler.sendPoll(val);
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
	if(obj["typ"] === 128){
		var clone = document.getElementById("msg_template").content.cloneNode(true);
		let msg = clone.querySelector(".msg_body");
		msg.textContent = obj["da"]["pl"].replace("\n", "<br>");

	}else if(obj["typ"] === 132){
		var clone = document.getElementById("cookie_template").content.cloneNode(true);
		clone.querySelector(".msg_body").setAttribute("id", new Date().toISOString());
	}else if(obj["typ"] === 130){
		var clone = addPollToChatBox(obj);
		var pollList = document.querySelector(".poll_list");
	}

	let name = clone.querySelector(".msg_head_name");
	name.textContent = obj["na"];
	name.style.color = obj["cl"];

	let time = clone.querySelector(".msg_head_time");
	time.textContent = (new Date()).toLocaleTimeString();

	var clone2 = clone;
	let box = document.getElementById("chat_box");
	box.appendChild(clone);
	box.scrollTop = box.scrollHeight;

	if(obj["typ"] === 130){
		console.log("tried my best");
		pollList.appendChild(clone2);
	}
}
