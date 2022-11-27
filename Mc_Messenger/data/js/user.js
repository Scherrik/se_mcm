const FLAG_TEST_LOCAL = true;

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
		var a = [];
		this.others.forEach((values, keys) => {
			a.push(values.name);
		})
		return a;
	}
	
	getId(name){
		this.others.forEach((values, keys) => {
			if(name === values.name){
				return keys;
			}
		})
		return -1;
	}
}

const udb = new UserDB();
Object.freeze(udb);
/*
export default udb;
*/
