const FLAG_TEST_LOCAL = false;

const IS_ANGRY = 1;
const IS_HUNGRY = 2;

class User {
	constructor(id=-1, name="Default", color="black", pkey="") {
		this.id = id;
		this.name = name;
		this.color = color;
		this.flags = 1;
		this.sendCount = 0;
		this.rcvdCount = 0;
	}
	
	addKeypair(keypair){
		this.keys = keypair;
	}
}

class UserDB {
	constructor(){
		this.dbHostToken = false;
		this.me = { 
			id: -1, 
			name: "Default", 
			color: "black", 
			keys: nacl.box.keyPair(),
			flags: 0
		}
		
		this.others = new Map();
		
		if(FLAG_TEST_LOCAL){
			this.others.set(1, {name: "Hans", color: "black"});
			this.others.set(2, {name: "Magnus", color: "black"});
			this.others.set(3, {name: "Kennedy", color: "black"});
			this.others.set(4, {name: "Atomfried Jesus", color: "black"});
		}
	}
	
	getNameList(){
		return [...this.others.values()];
	}
	
	getIdByName(name){
		return [...this.others.values()].find(([key,val]) => name == value)[0];
	}
	
	toObject(){
		// TODO Add groups to database
		var out = {}
		out[this.me.id] = { 
			na: this.me.name,
			cl: this.me.color,
			pk: bytesToString(this.me.keys.publicKey)
		};
		this.others.forEach((values, keys) => {
			out[keys] = {
				na: values.name,
				cl: values.color,
				pk: bytesToString(values.pk)
			};
		})
		return out;
	}
	
	toString(){
		return JSON.stringify(this.toObject());
	}
	
	updateUser(uid, obj){
		this.others.set(uid, obj);
		
		var event = new Event('change');
		//this.dispatchEvent(event);
	}
	
	updateDB(obj){
		this.others.clear();
		console.log("DB UPDATE");
		console.log(obj);
		for( let key in obj ){
			if(obj.hasOwnProperty(key)){
				obj[key]["pk"] = stringToBytes(obj[key]["pk"]);
				this.others.set(Number(key), obj[key]);
			}
		}
		//var event = new Event('change');
		//this.dispatchEvent(event);
	}
	
	setHostToken(b){
		this.dbHostToken = b;
	}
}

var udb = new UserDB();
/*
Object.freeze(udb);
export default udb;
*/
