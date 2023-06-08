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
		console.info("ON CONNECT");
	});
	document.addEventListener("mh_newuser", function(e){
		console.info("USER ADD TRIGGERED");
		if(userdb.me.id == e.detail.id) return;
		userdb.updateUser(e.detail.id, { na: "Guest", cl: "white", pk: e.detail.pk });
		addUserToUI(e.detail.id, userdb.others.get(e.detail.id));
	});
	document.addEventListener("mh_dbsync", function(e){
		console.info("DB SYNC TRIGGERED");
		userdb.update(e.detail.db);
		//userdb.setHostToken(e.detail.dbTok);
		updateUserlistInUI();
	});
	document.addEventListener("mh_messagerecv", function(e){
		console.info("MESSAGE RECEIVED TRIGGERED");
		console.info(e.detail);
        if(e.detail.msg.da.fl & IS_ANGRY){
            angrymode();
            setTimeout(function(){ angrymode(); }, 5000);
        }
		addMessageToChatBox(e.detail.msg);
	});
	document.addEventListener("mh_messagesent", function(e){
		console.info("MESSAGE SENT TRIGGERED");
		console.info(e.detail);
        
        if(FLAG_TEST_LOCAL){
            e.detail.frame["na"] = udb.me.na;
            e.detail.frame["cl"] = udb.me.cl;
            //addMessageToChatBox(frame);
        }
	});
	document.addEventListener("mh_metarecv", function(e){
		console.info("META CHANGE TRIGGERED");
		userdb.updateUser(e.detail.id, e.detail.meta);
		addUserToUI(e.detail.id, e.detail.meta);
	});
	document.addEventListener("mh_tokenchange", function(e){
        if(e.detail.token) console.info("I'm new host");
        else console.info("My token was stolen :(");
		//userdb.setHostToken(e.detail.dbTok);
	});
	document.addEventListener("mh_cldisconnect", function(e){
		console.info("OPPOSITE CLIENT " + e.detail.cid + " DISCONNECTED");
		userdb.removeUser(e.detail.cid);
		removeUserFromUI(e.detail.cid);
	});
	document.addEventListener("mh_interactionsent", function(e){
		console.info("INTERACTION SENT TRIGGERED");
		console.info(e.detail);
	});
	document.addEventListener("mh_interactionrecv", function(e){
		console.info("INTERACTION RECEIVED TRIGGERED");
		console.info(e.detail);
		interactionHandler(e.detail.msg);
	});
	
	// UI Element Event Listeners
	document.querySelector("#msgbtn_send").addEventListener("click", function(e) {
		let val = document.querySelector("#msg_input").value;
		console.info("BTN_SEND => " + val);
		msghandler.sendMessage(val);
	});
	
	document.querySelector("#msgbtn_angry").addEventListener("click", function(e) {
		let val = document.querySelector("#msg_input").value;
		console.info("BTN_SEND => " + val);
		userdb.me.fl |= IS_ANGRY;
		msghandler.sendMessage(val);
		userdb.me.fl &= ~IS_ANGRY;
	});

	document.querySelector("#add_poll_option").addEventListener("click", function (e){
		console.info("Poll option added to UI")
		addPollOption();
	});

	document.querySelector("#send_poll").addEventListener("click", function (e){
		let val = document.querySelector("#poll_question_field").value;
		console.info("POLL SENT TRIGGERED")
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
		console.info("Color updated: " + userdb.me.cl);
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
	console.info("UPDATE UL IN FRONTEND");
	console.info(userdb.toString());
	
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
	
	console.info("USER ADD " + id);
	console.info(user)
	
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
            // Or create a group?!
		}
	})
	userlist.appendChild(entry);
}

function removeUserFromUI(uid){
	document.getElementById("ul" + uid).remove();
}

function addMessageToChatBox(obj){
	console.info("Add message to chatbox");
	console.info(obj);
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
		console.info("tried my best");
		pollList.appendChild(clone2);
	}
}
