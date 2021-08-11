import { timestampType } from "../src";

describe("timestampType", () => {
    it("can convert from and to json", () => {
        const input = "2021-08-07T08:19:25.753Z";
        const value = timestampType.fromJsonValue(input);
        expect(value).toBeInstanceOf(Date);
        const output = timestampType.toJsonValue(value);
        expect(output).toBe(input);
    });
});
