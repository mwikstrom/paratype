import { binaryType } from "../src";
import { Buffer } from "buffer";

describe("binaryType", () => {
    it("can convert to json string", () => {
        const raw = Buffer.from("hello world", "ascii");
        const buf: ArrayBuffer = raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.byteLength);
        expect(binaryType.test(buf)).toBe(true);
        expect(Buffer.from(buf).toString("ascii")).toBe("hello world");
        const json = binaryType.toJsonValue(buf);
        expect(json).toBe("aGVsbG8gd29ybGQ=");
    });

    it("can convert from json string", () => {
        const json = "aGVsbG8gd29ybGQ=";
        const buf = binaryType.fromJsonValue(json);
        expect(binaryType.test(buf)).toBe(true);
        const str = Buffer.from(buf).toString("ascii");
        expect(str).toBe("hello world");
    });
});
