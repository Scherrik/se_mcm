var soc;
function init(){
	soc = new WebSocket('ws://' + window.location.hostname + '/ws');
	soc.onmessage = function(event) {
		document.getElementById("msg_box").innerHTML += "<br>" + (new Date()).toLocaleTimeString() + " " + event.data;
		
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

function sendMessage(){
	let msg = document.getElementById("msg_field").value;
	document.getElementById("msg_field").value = "";
	console.log(msg);
	soc.send(msg);
}
