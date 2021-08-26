import { integerType } from "../src";

describe("integer", () => {
    it("doesn't match decimal value", () => {
        expect(integerType.error(1.2)).toBe("Must be a safe integer");
    });
});