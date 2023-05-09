
//const userDatabase = require("./data/js/user");
const nacl = require("./data/js/nacl");
const msghandler = require("./data/js/message");

function log(expected, result) { console.log(expected + " = " + result); }

const testStrings = new Map([ "Hello World", "", "<&\n\"&:98uz4ß)(/&\"80", "{ na: \"Hans\", cl: \"#0908789\" }" ]);



for(let i = 0; i < testStrings.length; i++){
	test('EncryptDecrypt: ' + testStrings[i], () => {
		let sender = nacl.box.keyPair();
		let receiver = nacl.box.keyPair();	
		let testString = testStrings[i];
		let resultEnc = msghandle.encryptPayload(receiver.secretKey, sender.publicKey, testString);
		let resultDec = msghandle.decryptPayload(sender.secretKey, receiver.publicKey, resultEnc);
		log(testString, resultDec);
		expect(resultDec).toBe(testString);
	});
}

