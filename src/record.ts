import { _makeType } from "./internal/make";
import { isObject } from "./internal/utils";
import { Type, TypeOf } from "./type";

/**
 * Constructs a {@link Type} that represents a record with the specified properties
 * @param properties - Properties of the record. Must be an object where keys provide property names,
 *                     and values their {@link Type}
 * @param options - <i>(Optional)</i> Provides record type behavior
 * @public
 */
export function recordType<T extends Record<string, Type<unknown>>, O extends (keyof T)[] = []>(
    properties: T,
    options?: RecordOptions<O>,
): Type<RecordProperties<T, O>> {
    const props = new Map(Object.entries(properties));
    const optional = new Set(options?.optional || []);
    const test = (value: unknown) => {
        if (!isObject(value)) {
            return false;
        }

        for (const key of props.keys()) {
            if (!optional.has(key) && !(key in value)) {
                return false;
            }
        }

        for (const [key, item] of Object.entries(value)) {
            const type = props.get(key);
            if (!type || !type.test(item)) {
                return false;
            }
        }

        return true;
    };
    return _makeType({ test });
}

/** 
 * Extracts the underlying types from properties supplied to {@link recordType}
 * @public 
 */
export type RecordProperties<T extends Record<string, Type<unknown>>, O extends (keyof T)[]> = (
    {[P in Exclude<keyof T, O[number]>]: TypeOf<T[P]>} &
    {[P in O[number]]?: TypeOf<T[P]>}
);

/**
 * Specifies behavior for a record type
 * @public
 */
export interface RecordOptions<O> {
    /** An array of property names that shall be optional (not required) in the record type */
    optional?: O;
    // TODO: Additional props
}
