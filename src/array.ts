import { _makeType } from "./internal/make";
import { _checkArray, _formatError } from "./internal/utils";
import { Type } from "./type";

/**
 * Constructs a {@link Type} that represents an array of the specified item type.
 * @param itemType - Type of items in the array
 * @public
 **/
export function arrayType<T>(itemType: Type<T>): Type<T[]> {
    const error: Type["error"] = (value, path) => (
        Array.isArray(value) ? 
            _checkArray(value, path, itemType.error) :
            _formatError("Must be an array", path)
    );
    return _makeType({ error });
}
