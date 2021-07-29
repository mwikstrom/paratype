import { TypeOptions, _makeType } from "./internal/make";
import { _isObject, _checkArray, _checkRecord, _formatError } from "./internal/utils";

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

const error: TypeOptions["error"] = (value, path = []) => {
    if (value === null || typeof value === "string" || typeof value === "boolean") {
        return void(0);
    }

    if (typeof value === "number") {
        return isFinite(value) ? void(0) : _formatError("Number must be finite", path);
    }

    if (Array.isArray(value)) {
        return _checkArray(value, path, error);
    }

    if (_isObject(value)) {
        return _checkRecord(value, path, error);
    }

    return _formatError("Must be a JSON value", path);
};

/**
 * Matches JSON values
 * @public
 */
export const jsonValueType = _makeType<JsonValue>({ error });
