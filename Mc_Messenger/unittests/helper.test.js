
const helper = require("../data/js/helper");


const table = [
    ["", true],
    [undefined, true],
    [null, true],
    [0, true],
    ["\r\n", true],
    [" ", true],
    ["Hello world", false]
];

test("Testing if we are testing with jest", () => {
    expect(helper.areWeTestingWithJest()).toStrictEqual(true);
});


test.each(table)("is string %s empty", (obj, expected) => {
    expect(helper.isEmpty(obj)).toStrictEqual(expected);
});
