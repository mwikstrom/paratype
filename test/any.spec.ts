import { anyType } from "../src";

describe("anyType", () => {
    const t = anyType;
    const shouldBeOk = [
        true,
        false,
        null,
        undefined,
        new Date(),
        ["hello", "world"],
        "foo",
        {
            foo: "bar"
        },
        12.34,
        /^pattern$/,
        () => void 0,
    ];
    shouldBeOk.forEach(value => it(`matches ${value}`, () => expect(t.test(value)).toBe(true)));
});
