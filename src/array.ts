import { _makeType } from "./internal/make";
import { Type } from "./type";

/**
 * Constructs a {@link Type} that represents an array of the specified item type.
 * @param itemType - Type of items in the array
 * @public
 **/
export function arrayType<T>(itemType: Type<T>): Type<T[]> {
    const test = (value: any) => Array.isArray(value) && value.every(itemType.test);
    return _makeType({ test });
}
