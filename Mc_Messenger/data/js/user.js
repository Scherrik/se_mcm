const FLAG_TEST_LOCAL = false;

const IS_ANGRY = 1;
const IS_HUNGRY = 2;

class User {
	constructor(id=-1, name="Default", color="black", pkey="") {
		this.id = id;
		this.na = name;
		this.cl = color;
		this.fl = 1;
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
			na: "Default", 
			cl: "black", 
			keys: nacl.box.keyPair(),
			fl: 0
		}
		
		this.others = new Map();
		
		if(FLAG_TEST_LOCAL){
			this.others.set(1, {na: "Hans",   			cl: "black"});
			this.others.set(2, {na: "Magnus", 			cl: "black"});
			this.others.set(3, {na: "Kennedy", 			cl: "black"});
			this.others.set(4, {na: "Atomfried Jesus",  cl: "black"});
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
			na: this.me.na,
			cl: this.me.cl,
			pk: bytesToString(this.me.keys.publicKey)
		};
		this.others.forEach((values, keys) => {
			out[keys] = {
				na: values.na,
				cl: values.cl,
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
		
		adduser(uid, obj);
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
		
		updateUserlist();
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
