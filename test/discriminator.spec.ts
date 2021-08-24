import { constType, discriminatorType, integerType, recordType, stringType } from "../src";

describe("discriminatorType", () => {
    const typeA = recordType({
        key: constType("a"),
        value: stringType,
    });
    const typeB = recordType({
        key: constType("b"),
        value: integerType,
    });
    const union = discriminatorType("key", {
        a: typeA,
        b: typeB,
    });
    it("matches valid", () => {
        expect(union.test({key: "a", value: "foo"})).toBe(true);
        expect(union.test({key: "b", value: 123})).toBe(true);
    });
    it("doesn't match invalid and exposes inner error", () => {
        expect(union.error({key: "a", value: 123})).toBe("value: Must be a string");
        expect(union.error({key: "b", value: "foo"})).toBe("value: Must be a number");
    });
    it("doesn't match unknown discriminator", () => {
        expect(union.error({key: "c"})).toBe("key: Unknown type");
    });
    it("requires discriminator property", () => {
        expect(union.error({})).toBe("Missing required property: key");
    });
    it("requires an object", () => {
        expect(union.error("foo")).toBe("Must be a record object");
        expect(union.error(null)).toBe("Must be a record object"); 
    });
});
