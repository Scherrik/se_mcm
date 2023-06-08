
const userdb = require("../data/js/user");
const nacl = require("../data/js/nacl");

const table = [
    [ { id: "-1", obj: { na: "Guest", cl: "white", pk: [49, 0, 1] } }, { "-1": { na: "Guest", cl: "white", pk: [49, 0, 1] } } ],
    [ { id: "2", obj: { na: "Erik", cl: "white", pk: [49, 0, 1] } }, { "-1": { na: "Guest", cl: "white", pk: [49, 0, 1] }, 2: { na: "Erik", cl: "white", pk: [49, 0, 1] } } ]
];


userdb.init();
userdb.me.keys.pk = "0"

test.each(table)("Add user to db", (obj, expected) => {
    console.log(obj.id);
    userdb.updateUser(obj.id, obj.obj);
    
    expect(userdb.toObject()).toStrictEqual(expected);
});


const deltable = [
    [ { id: "2", obj: { na: "Erik", cl: "white", pk: [ 49, 0, 1 ] } }, { "-1": { na: "Guest", cl: "white", pk: [ 49, 0, 1 ] } } ]
];

test.each(deltable)("Remove user to db", (obj, expected) => {
    console.log(obj.id);
    userdb.removeUser(obj.id, obj.obj);
    
    expect(userdb.toObject()).toStrictEqual(expected);
});


