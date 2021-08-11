import { _checkArray } from "./internal/check-array";
import { _assertPath } from "./internal/check-path";
import { _formatError } from "./internal/format-error";
import { _makeType } from "./internal/make-type";
import { _makeTypeError } from "./internal/make-type-error";
import { JsonValue } from "./json";
import { Type } from "./type";

/**
 * Constructs a {@link Type} that represents an array of the specified item type.
 * @param itemType - Type of items in the array
 * @public
 **/
export function arrayType<T>(itemType: Type<T>): Type<T[]> {
    const error: Type["error"] = (value, path, shallow) => (
        Array.isArray(value) ? 
            shallow ? void(0) : _checkArray(value, path, itemType.error) :
            _formatError("Must be an array", path)
    );

    const fromJsonValue: Type<T[]>["fromJsonValue"] = async (value, context = {}) => {
        const { error: makeError = _makeTypeError } = context;
        const path = _assertPath(context);

        if (!Array.isArray(value)) {
            throw makeError(_formatError("Must a JSON array", path));
        }
        
        const depth = path.length;
        const result = new Array<T>();
        let index = 0;        
        path.push(index);

        for (const item of value) {
            result.push(await itemType.fromJsonValue(item, context));
            path[depth] = ++index;
        }

        path.pop();
        return result;
    };
    
    const toJsonValue: Type<T[]>["toJsonValue"] = async (value, context = {}) => {
        const path = _assertPath(context);
        const result = new Array<JsonValue>();
        const depth = path.length;
        let index = 0;        
        path.push(index);
        
        for (const item of value) {
            result.push(await itemType.toJsonValue(item, context));
            path[depth] = ++index;
        }

        path.pop();
        return result;
    };

    return _makeType({ error, fromJsonValue, toJsonValue });
}
