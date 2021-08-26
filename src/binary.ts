import { _formatError } from "./internal/format-error";
import { _makeType } from "./internal/make-type";
import { _makeTypeError } from "./internal/make-type-error";
import { Type } from "./type";

/** 
 * Matches `ArrayBuffer` values
 * @public
 */
export const binaryType: Type<ArrayBufferLike> = _makeType<ArrayBufferLike>({
    error: (value, path) => isArrayBufferLike(value) ? void(0) : _formatError("Must be an ArrayBuffer instance", path),
    equals: (first, second) => {
        if (first === second) {
            return true;
        }

        if (!isArrayBufferLike(second)) {
            return false;
        }

        if (first.byteLength !== second.byteLength) {
            return false;
        }

        const firstView = new DataView(first);
        const secondView = new DataView(second);

        for (let i = 0; i < first.byteLength; ++i) {
            if (firstView.getUint8(i) !== secondView.getUint8(i)) {
                return false;
            }
        }

        return true;
    },
    toJsonValue: value => Buffer.from(value).toString("base64"),
    fromJsonValue: (value, error, path) => {
        if (typeof value !== "string") {
            throw (error || _makeTypeError)(_formatError("Must be a string", path));
        }
        const raw = Buffer.from(value, "base64");
        return raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.byteLength);
    }
});

function isArrayBufferLike(value: unknown): value is ArrayBufferLike {
    return (
        typeof value === "object" &&
        value !== null &&
        "byteLength" in value &&
        "slice" in value &&
        typeof (value as Record<string, unknown>)["byteLength"] === "number" &&
        typeof (value as Record<string, unknown>)["slice"] === "function"
    );
}
