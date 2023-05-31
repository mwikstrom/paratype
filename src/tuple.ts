import { _checkArray } from "./internal/check-array";
import { _assertPath } from "./internal/check-path";
import { _formatError } from "./internal/format-error";
import { _makeType } from "./internal/make-type";
import { _makeTypeError } from "./internal/make-type-error";
import { JsonValue } from "./json";
import { Type } from "./type";

/**
 * Constructs a {@link Type} that represents a tuple with the specified item types.
 * @param itemTypes - Type of items in the tuple
 * @public
 **/
export function tupleType<T extends [...unknown[]]>(...itemTypes: { [I in keyof T]: Type<T[I]> }): Type<T> {
    const error: Type["error"] = (value, path, shallow) => {
        if (!Array.isArray(value) || value.length !== itemTypes.length) {
            return _formatError(`Must be a ${itemTypes.length}-tuple`, path);
        } else if (!shallow) {
            return _checkArray(
                value, 
                path, 
                (item, path) => itemTypes[path[path.length - 1] as number].error(item, path)
            );
        }        
    };

    const equals = (first: T, second: unknown): boolean => (
        Array.isArray(second) &&
        first.length === second.length &&
        first.every((item, index) => itemTypes[index].equals(item, second[index]))
    );

    const fromJsonValue: Type<T>["fromJsonValue"] = (value, makeError = _makeTypeError, path) => {
        if (!Array.isArray(value)) {
            throw makeError(_formatError("Must be a JSON array", path));
        }

        const depth = (path = _assertPath(path)).length;
        const result = new Array<T[number]>();
        let index = 0;        
        path.push(index);

        for (const item of value) {
            result.push(itemTypes[index].fromJsonValue(item, makeError, path));
            path[depth] = ++index;
        }

        path.pop();
        return result as T;
    };
    
    const toJsonValue: Type<T>["toJsonValue"] = (value, makeError, path) => {
        const result = new Array<JsonValue>();
        const depth = (path = _assertPath(path)).length;
        let index = 0;        
        path.push(index);
        
        for (const item of value) {
            result.push(itemTypes[index].toJsonValue(item, makeError, path));
            path[depth] = ++index;
        }

        path.pop();
        return result;
    };

    return _makeType({ error, equals, fromJsonValue, toJsonValue });
}
