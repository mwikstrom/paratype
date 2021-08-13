import { integerType, mapType } from "../src";

describe("mapType", () => {
    const t = mapType(integerType);

    it("detects bad key", () => {
        const bad = new Map().set(123, 456);
        const err = t.error(bad);
        expect(err).toBe("Every mapped key must be a string");
    });

    it("detects bad value", () => {
        const bad = new Map().set("abc", "def");
        const err = t.error(bad);
        expect(err).toBe("abc: Must be a number");
    });

    it("accepts valid", () => {
        const bad = new Map().set("abc", 123);
        const err = t.error(bad);
        expect(err).toBeUndefined();
    });

    it("can convert to json", () => {
        const val = new Map().set("abc", 123);
        const json = t.toJsonValue(val);
        expect(json).toMatchObject({abc: 123});
    });

    it("can convert from json", () => {
        const json = { abc: 123 };
        const val = t.fromJsonValue(json);
        expect(val.size).toBe(1);
        expect(val.has("abc")).toBe(true);
        expect(val.get("abc")).toBe(123);
    });
});
