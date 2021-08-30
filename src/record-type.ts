import { _assertPath } from "./internal/check-path";
import { _checkRecord } from "./internal/check-record";
import { _formatError } from "./internal/format-error";
import { _isRecord } from "./internal/is-record";
import { _makeType } from "./internal/make-type";
import { _makeTypeError } from "./internal/make-type-error";
import { JsonObject } from "./json";
import { PathArray } from "./path";
import { Type } from "./type";

/**
 * Constructs a {@link Type} that represents a record with the specified properties
 * @param properties - Properties of the record. Must be an object where keys provide property names,
 *                     and values their {@link Type}
 * @public
 */
export function recordType<T extends Record<string, unknown>>(
    properties: PropertyTypes<T>,
): RecordType<T> {
    const props = new Map<keyof T, Type<T[keyof T]>>(Object.entries(properties));
    const makeRecordType = <K extends string & keyof T>(
        optional = new Set<K>()
    ): RecordType<Omit<T, K> & Partial<Pick<T, K>>> => {
        const checkMissing = (value: Record<string, unknown>, path?: PathArray): string | undefined => {
            for (const key of props.keys()) {
                if (!optional.has(key as K) && value[key as string] === void(0)) {
                    return _formatError(`Missing required property: ${key}`, path);
                }
            }
        };

        const error: Type["error"] = (value, path, shallow) => {
            if (!_isRecord(value)) {
                return _formatError("Must be a record object", path);
            }

            const missing = checkMissing(value, path);
            if (missing !== void(0)) {
                return missing;
            }

            return _checkRecord(value, path, shallow, (propValue, propPath) => {
                const propName = propPath.slice(-1)[0] as string;
                const propType = props.get(propName);
                if (!propType) {
                    return _formatError("Invalid property name", propPath);
                } else if (propValue === void(0) && optional.has(propName as K)) {
                    return void(0);
                } else {
                    return propType.error(propValue, propPath);
                }
            });
        };

        const equals = (first: T, second: unknown): boolean => {
            if (!_isRecord(second)) {
                return false;
            }

            const firstMap = new Map(Object.entries(first).filter(([,value]) => value !== void(0)));
            const secondMap = new Map(Object.entries(second).filter(([,value]) => value !== void(0)));

            if (firstMap.size !== secondMap.size) {
                return false;
            }

            for (const [propName, firstValue] of firstMap) {
                const propType = props.get(propName);
                const secondValue = secondMap.get(propName);
                if (secondValue === void(0) || !propType?.equals(firstValue as T[keyof T], secondValue)) {
                    return false;
                }
            }

            return true;
        };

        const fromJsonValue: Type<T>["fromJsonValue"] = (value, makeError = _makeTypeError, path) => {
            if (!_isRecord(value)) {
                throw makeError(_formatError("Must be a JSON object", path));
            }

            const missing = checkMissing(value, path);
            const result: Record<string, unknown> = {};
            if (missing !== void(0)) {
                throw makeError(missing);
            }

            const depth = (path = _assertPath(path)).length;
            path.push("");

            for (const [key, item] of Object.entries(value)) {
                const propType = props.get(key);
                path[depth] = key;
                if (!propType) {
                    throw makeError(_formatError("Invalid property name", path));
                }
                result[key] = propType.fromJsonValue(item, makeError, path);
            }

            path.pop();
            return result as T;
        };

        const toJsonValue: Type<T>["toJsonValue"] = (value, makeError = _makeTypeError, path) => {
            const result: JsonObject = {};
            const depth = (path = _assertPath(path)).length;
            path.push("");

            for (const [key, item] of Object.entries(value)) {
                const propType = props.get(key);
                path[depth] = key;
                if (!propType) {
                    throw makeError(_formatError("Invalid property name", path));
                }
                if (item !== void(0) || !optional.has(key as K)) {
                    result[key] = propType.toJsonValue(item as T[keyof T], makeError, path);
                }            
            }

            path.pop();
            return result;
        };

        type M<P extends keyof RecordType<T>> = RecordType<Omit<T, K> & Partial<Pick<T, K>>>[P];
        
        const asPartial = (
            () => makeRecordType(new Set(props.keys() as Iterable<string & keyof T>))
        ) as unknown as M<"asPartial">;

        const isOptional: M<"isOptional"> = (key: string) => optional.has(key as K);

        const getPropertyNames = (
            () => props.keys() as unknown as Iterable<keyof T>
        ) as unknown as M<"getPropertyNames">;

        const getPropertyType: M<"getPropertyType"> = <K extends keyof T>(key: K) => props.get(key) as Type<T[K]>;

        const withOptional = (<O extends (string & keyof T)>(...keys: O[]) => (
            makeRecordType<K & O>(new Set([...optional.keys(), ...keys] as (K & O)[]))
        )) as unknown as M<"withOptional">;

        const pick = (<S extends Partial<T>>(source: S): Pick<S, keyof T> => (
            Object.assign({}, Object.fromEntries(Object
                .entries(source)
                .filter(([key]) => props.has(key)))
            ) as Pick<S, keyof T>
        )) as unknown as M<"pick">;

        return Object.freeze({
            ..._makeType<T>({ error, equals, fromJsonValue, toJsonValue }),
            asPartial,
            isOptional,
            getPropertyNames,
            getPropertyType,
            pick,
            withOptional,
        });
    };

    return makeRecordType<never>();
}

/**
 * Maps properties to their corresponding run-time types
 * @public
 */
export type PropertyTypes<T extends Record<string, unknown>> = {
    [P in keyof T]-?: Type<Exclude<T[P], undefined>>;
};

/**
 * A run-time record type
 * @public
 */
export interface RecordType<T> extends Type<T> {
    /**
     * Returns a new record type based on the current type but where all properties are optional
     */
    asPartial(this: void): RecordType<Partial<T>>;

    /**
     * Gets the property names
     */
    getPropertyNames(): Iterable<keyof T>;

    /**
     * Gets the run-time type of the specified property
     */
    getPropertyType(key: string): Type<unknown> | undefined;
    getPropertyType<K extends keyof T>(key: K): Type<T[K]>;

    /**
     * Determines whether the specified property is optional
     */
    isOptional(key: string): boolean;

    /**
     * Picks the properties in this record type from the specified source object
     */
    pick<S extends Partial<T>>(source: S): Pick<S, keyof T>;

    /**
     * Returns a new record type based on the current type but where the specified properties are optional
     */
    withOptional<K extends (string & keyof T)>(...keys: K[]): RecordType<Omit<T, K> & Partial<Pick<T, K>>>;

    // TODO: extend with new props
    
    // TODO: allow additional props: Record<string, X>
}

/**
 * Specifies behavior for a record type
 * @public
 */
export interface RecordOptions<O extends string[] = []> {
    /** An array of property names that shall be optional (not required) in the record type */
    optional?: O;
    // TODO: Additional props
}
