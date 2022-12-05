function isEmpty(str){
	return (!str || str.trim().length === 0);
}

function init(){
	soc = new WebSocket('ws://' + window.location.hostname + '/ws');
	soc.onmessage = function(event) {
		console.debug("MSG: " + event.data);
		// Send messages as JSON String is possibly the way to go?! Yes it is!
		var json_obj = JSON.parse(event.data);
		MessageHandle.processIncomingMessage(json_obj);
	}
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
var wcount = document.getElementById("charcount");
input.addEventListener("keydown", function(event){
	wcount.innerHTML = String(input.value.length).padStart(3, '0') + "/500";
	if(event.key == "Enter"){
		event.preventDefault();
		if(event.shiftKey){
			input.value = input.value + "\n";
		} else {
			if(event.ctrlKey){
				udb.me.flags |= IS_ANGRY;
			} else {
				udb.me.flags &= ~IS_ANGRY;
			}
			MessageHandle.sendMessage();
		}
	}
});

function test_message(msg){	
	MessageHandle.print( MessageHandle.create("msg", msg) );
}

//color selector + update color
var colorPicker = document.getElementById("user_color");
colorPicker.addEventListener("change", function(event){
	udb.me.color = event.target.value;
	console.log("Color updated: " + udb.me.color);
	MessageHandle.sendMetaChange();
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
