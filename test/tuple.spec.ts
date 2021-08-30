import { numberType, stringType, tupleType } from "../src";

describe("tupleType", () => {
    it("matches valid array", () => {
        const t = tupleType(stringType, numberType);
        expect(t.test(["abc", 123])).toBe(true);
    });
});