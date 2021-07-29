import { _checkArray } from "./internal/check-array";
import { _formatError } from "./internal/format-error";
import { _makeType } from "./internal/make-type";
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
    
    const toJsonValue: Type<T[]>["toJsonValue"] = value => {
        const result = new Array<JsonValue>();

        for (const item of value) {
            const mapped = itemType.toJsonValue(item);
            if (mapped === void(0)) {
                return void(0);
            }
            result.push(mapped);
        }

        return result;
    };

    return _makeType({ error, toJsonValue });
}
