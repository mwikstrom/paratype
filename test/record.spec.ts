import { booleanType, JsonObject, numberType, recordType, stringType } from "../src";

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
        const e3 = t.error({a:"foo", b: undefined});
        expect(e3).toBe("Missing required property: b");        
    });

    it("doesn't require optional prop", () => {
        const e = t.error({ a: "foo", b: 123 });
        expect(e).toBeUndefined();
    });

    it("accepts optional prop", () => {
        const e = t.error({ a: "foo", b: 123, c: false });
        expect(e).toBeUndefined();
    });

    it("ignores undefined optional prop", () => {
        const v = { a: "foo", b: 123, c: undefined };
        const e = t.error(v);
        expect(e).toBeUndefined();
        const o = t.toJsonValue(v);
        expect(o).toMatchObject({a: "foo", b: 123 });
        expect("c" in (o as JsonObject)).toBe(false);
    });

    it("validates required prop", () => {
        const e = t.error({ a: "foo", b: "bar" });
        expect(e).toBe("b: Must be a number");
    });

    it("validates optional prop", () => {
        const e = t.error({ a: "foo", b: 123, c: "bar" });
        expect(e).toBe("c: Must be a boolean");
    });

    it("doesn't accept additional prop", () => {
        const e = t.error({ a: "foo", b: 123, c: false, d: "bar" });
        expect(e).toBe("d: Invalid property name");
    });
});
