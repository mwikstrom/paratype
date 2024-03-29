import { _checkArray } from "./internal/check-array";
import { _checkRecord } from "./internal/check-record";
import { _formatError } from "./internal/format-error";
import { _isRecord } from "./internal/is-record";
import { _makeType } from "./internal/make-type";
import { Type } from "./type";

/**
 * A JSON value
 * @public
 */
export type JsonValue = JsonPrimitive | JsonArray | JsonObject;

/**
 * One of the JSON primitive types
 * @public
 */
export type JsonPrimitive = string | number | boolean | null;

/**
 * An array of JSON values
 * @public 
 */
export type JsonArray = Array<JsonValue>;

/**
 * An object where keys are strings and values are JSON values
 * @public
 */
// This can't be a type alias because it would be a type reference loop
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface JsonObject extends Record<string, JsonValue> { }

const error: Type["error"] = (value, path, shallow) => {
    if (value === null || typeof value === "string" || typeof value === "boolean") {
        return void(0);
    }

    if (typeof value === "number") {
        return isFinite(value) ? void(0) : _formatError("Number must be finite", path);
    }

    if (Array.isArray(value)) {
        return shallow ? void(0) : _checkArray(value, path, error);
    }

    if (_isRecord(value)) {
        return _checkRecord(value, path, shallow, error);
    }

    return _formatError("Must be a JSON value", path);
};

/**
 * Matches JSON values
 * @public
 */
export const jsonValueType: Type<JsonValue> = _makeType({
    error, 
    equals: (first, second) => (
        error(second) !== void(0) &&
        JSON.stringify(first) === JSON.stringify(second)
    ),
    fromJsonValue: (value, makeError, path) => {
        jsonValueType.assert(value, makeError, path);
        return  value;
    },
    toJsonValue: value => value,
});
