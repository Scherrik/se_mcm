
//const userdb = require("../data/js/user");
const nacl = require("../data/js/nacl");
const msghandler = require("../data/js/message");
//const main = require("../data/js/main");

//function log(expected, result) { console.log(expected + " = " + result); }

//const testStrings = new Map([ "Hello World", "", "<&\n\"&:98uz4ß)(/&\"80", "{ na: \"Hans\", cl: \"#0908789\" }" ]);

const table = [
    [ "Hello World", "Hello World" ],
    [ "", "" ],
    [ "<&\n\"&:98uz4ß)(/&\"80", "<&\n\"&:98uz4ß)(/&\"80" ],
    [ "{ na: \"Hans\", cl: \"#0908789\" }", "{ na: \"Hans\", cl: \"#0908789\" }" ]
];


test.each(table)("Encrypt and decrypt %s", (str, expected) => {
    let sender = nacl.box.keyPair();
    let receiver = nacl.box.keyPair();
    const encrypt = msghandler.__get__('encrypt');
    const decrypt = msghandler.__get__('decrypt');
    let resultEnc = encrypt(receiver.secretKey, sender.publicKey, str);
    let resultDec = decrypt(sender.secretKey, receiver.publicKey, resultEnc);
    //log(testString, resultDec);
    expect(resultDec).toBe(expected);
});


const payloadTypeTable = [
    [ "message", { fl: 0, pl: {} } ],
    [ "metaInfo", { na: "Default", cl: "white" } ],
    [ "serverPoll", {} ],
    [ "poll", {qu: undefined, an: undefined, id: undefined } ]
];

test.each(payloadTypeTable)("Create payload for %s", (str, expected) => {
    const createPayload = msghandler.__get__('createPayload');
    console.log(str);
    let result = createPayload(str);
    console.log(result);
    
    expect(result).toStrictEqual(expected);
});


