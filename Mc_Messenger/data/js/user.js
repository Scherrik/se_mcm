(function(userdb) {
'use strict';

var salt;
var helpster;
if(typeof module !== 'undefined'){
    // FOR JEST UNIT TESTING
    console.log("MODULE FOUND");
    salt = require("./nacl.js");
    salt.util = require("./nacl-util.js");
    helpster = require("./helper.js");
} else {
    salt = nacl;
    salt.util = nacl.util;
    helpster = helper;
}
/*
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
/*
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
	*/
	
    userdb.createGroup = function(id, name){
        let keyPairs = salt.box.keyPair();
        userdb.updateUser(id, {
            na: name,
            pk: keyPairs.publicKey,
            sk: keyPairs.secretKey
        })
        console.debug(keyPairs);
        console.debug(userdb.others);
    }

	userdb.init = function(){
		userdb.me = { 
			id: -1, 
			na: "Default", 
			cl: "white", /* depends on chosen theme, but we start by default with dark one */
			keys: salt.box.keyPair(),
			fl: 0
		}
		userdb.others = new Map();
	}
	
	userdb.getNameList = function(){
		return [...userdb.others.values()];
	}
	
	userdb.getIdByName = function(name){
        let result = -1;
		userdb.others.forEach((values, keys) => {
			if(values.na === name){
                console.debug("FOUND " + name + " with id " + keys);
                result = keys;
            }
		})
        return result;
		//return [...userdb.others.values()].find(([key,val]) => name == value)[0];
	}
	
	userdb.toObject = function(){
		// TODO Add groups to database
		var out = {}
		out[userdb.me.id] = { 
			na: userdb.me.na,
			cl: userdb.me.cl,
			pk: [...userdb.me.keys.publicKey]
		};
		userdb.others.forEach((values, keys) => {
			out[keys] = {
				na: values.na,
				cl: values.cl,
				pk: [...values.pk],
			};
            // For the pseudo users, dont do this for userdb.me object!
            if(values.sk){
                out[keys].sk = [...values.sk];
            }
		})
		return out;
	}
	
	userdb.toString = function(){
		return JSON.stringify(userdb.toObject());
	}
	
	userdb.removeUser = function(uid){
		userdb.others.delete(uid);
	}
	
	userdb.updateUser = function(uid, obj){
		userdb.others.set(uid, {...userdb.others.get(uid), ...obj});
	}
	
	// Update whole database
	userdb.update = function(obj){
		userdb.others.clear();
		console.info("DB UPDATE");
		console.info(obj);
		for( let key in obj ){
			if(obj.hasOwnProperty(key)){
                console.debug("ID: " + key);
                if(key == userdb.me.id) continue;
                
                console.debug(Uint8Array.from(obj[key]["pk"]));
				obj[key]["pk"] = Uint8Array.from(obj[key]["pk"]);
                if(obj[key]["sk"]){
                    obj[key]["sk"] = Uint8Array.from(obj[key]["sk"]);    
                }
				userdb.others.set(Number(key), obj[key]);
			}
		}
		
		// Has to be replaced by event, no direct access to UI and vice versa should be the way to go
		updateUserlistInUI();
	}
})(typeof module !== 'undefined' && module.exports ? module.exports : (self.userdb = self.userdb || {}));
/*
Object.freeze(udb);
export default udb;
*/
