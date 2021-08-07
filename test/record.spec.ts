import { booleanType, numberType, recordType, stringType } from "../src";

describe("recordType", () => {
    const t = recordType({
        a: stringType,
        b: numberType,
        c: booleanType,
    }, { optional: ["c"] });

    it("detects missing prop", () => {
        const e1 = t.error({});
        expect(e1).toBe("Missing required property: a");        
        const e2 = t.error({a:"foo"});
        expect(e2).toBe("Missing required property: b");        
    });

    it("doesn't require optional prop", () => {
        const e = t.error({ a: "foo", b: 123 });
        expect(e).toBeUndefined();
    });

    it("accepts optional prop", () => {
        const e = t.error({ a: "foo", b: 123, c: false });
        expect(e).toBeUndefined();
    });

    it("doesn't accept additional prop", () => {
        const e = t.error({ a: "foo", b: 123, c: false, d: "bar" });
        expect(e).toBe("d: Invalid property name");
    });
});
