import { _assertPath, _checkPath } from "./internal/check-path";
import { _formatError } from "./internal/format-error";
import { _isRecord } from "./internal/is-record";
import { _makeType } from "./internal/make-type";
import { _makeTypeError } from "./internal/make-type-error";
import { JsonObject } from "./json";
import { Type } from "./type";

/**
 * Constructs a {@link Type} that represents a map with string keys and uniform values
 * @param valueType - Type of values
 * @public
 **/
export function mapType<T>(valueType: Type<T>): Type<Map<string, T>> {
    const error: Type["error"] = (map, path, shallow) => {
        if (!(map instanceof Map)) {
            return _formatError("Must be an instance of Map", path);
        }

        if (shallow) {
            return void(0);
        }

        for (const key of map.keys()) {
            if (typeof key !== "string") {
                return _formatError("Every mapped key must be a string", path);
            }
        }

        const depth = (path = path || []).length;
        let result = _checkPath(path);
    
        if (result === void(0)) {
            path.push("");
    
            for (const [key, value] of map) {
                path[depth] = key;
                if ((result = valueType.error(value, path)) !== void(0)) {
                    break;
                }
            }
    
            path.pop();
        }
    
        return result;
    };

    const fromJsonValue: Type<Map<string, T>>["fromJsonValue"] = (value, makeError = _makeTypeError, path) => {
        if (!_isRecord(value)) {
            throw makeError(_formatError("Must be a JSON object", path));
        }

        const result = new Map<string, T>();
        const depth = (path = _assertPath(path)).length;
        path.push("");

        for (const [key, item] of Object.entries(value)) {
            path[depth] = key;
            result.set(key, valueType.fromJsonValue(item, makeError, path));
        }

        path.pop();
        return result;
    };

    const toJsonValue: Type<Map<string, T>>["toJsonValue"] = (value, makeError = _makeTypeError, path) => {
        const result: JsonObject = {};
        const depth = (path = _assertPath(path)).length;
        path.push("");

        for (const [key, item] of value) {
            path[depth] = key;
            result[key] = valueType.toJsonValue(item, makeError, path);
        }

        path.pop();
        return result;
    };

    const equals = (first: Map<string, T>, second: unknown) => {
        if (!(second instanceof Map)) {
            return false;
        }

        if (first.size !== second.size) {
            return false;
        }

        for (const [propName, firstValue] of first) {
            const secondValue = second.get(propName);
            if (secondValue === void(0) || !valueType.equals(firstValue, secondValue)) {
                return false;
            }
        }

        return true;
    };

    return _makeType({ error, equals, toJsonValue, fromJsonValue });
}
