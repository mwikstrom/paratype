import { _isRecord } from "./internal/is-record";
import { JsonValue } from "./json";
import { PathArray } from "./path";

/**
 * A run-time type
 * @public
 */
export interface Type<T = unknown> {
    /**
     * Asserts that the specified value matches the current run-time type.
     * A `TypeError` is thrown in case the value doesn't match.
     * @param this - <i>(Ignored)</i> This method uses implicit `this` binding
     * @param value - The value to be checked
     * @param path - <i>(Optional)</i> Path to the value
     */
    assert(this: void, value: unknown, path?: PathArray): asserts value is T;

    /**
     * Returns an error message when the specified value doesn't match the current run-time type,
     * and otherwise `undefined`.
     * @param this - <i>(Ignored)</i> This method uses implicit `this` binding
     * @param value - The value to be checked
     * @param path - <i>(Optional)</i> Path to the value
     * @param shallow - <i>(Optiona)</i> When `true` errors from array items or record properties are ignored
     */
    error(this: void, value: unknown, path?: PathArray, shallow?: boolean): string | undefined;

    /**
     * Converts the specified JSON value to a value that matches the current run-time type.
     * @param this - <i>(Ignored)</i> This method uses implicit `this` binding
     * @param value - The value to be converted
     */
    fromJsonValue(this: void, value: JsonValue, path?: PathArray): T;

     /**
     * Constructs a new {@link Type} that represents a restriction of the current run-time type.
     * @param this - <i>(Ignored)</i> This method uses implicit `this` binding
     * @param message - The error message to show when predicate doesn't match
     * @param predicate - A predicate that represents the restriction
     */
    restrict(this: void, message: string, predicate: Predicate<T>): Type<T>;

    /**
     * Determines whether the specified value matches the current run-time type.
     * @param this - <i>(Ignored)</i> This method uses implicit `this` binding
     * @param value - The value to be checked
     * @param path - <i>(Optional)</i> Path to the value
     * @returns `true` if the value matches; otherwise, `false`
     */
    test(this: void, value: unknown, path?: PathArray): value is T;

    /**
     * Converts the specified value, which is assumed to match the current run-time type,
     * to a {@link JsonValue}.
     * @param this - <i>(Ignored)</i> This method uses implicit `this` binding
     * @param value - The value to be converted
     * @param depth - <i>(Optional)</i> Path depth of the value
     * @returns A {@link JsonValue} that represents the specified value when conversion is
     *          successful, and `undefined` otherwise.
     */
    toJsonValue(this: void, value: T, depth?: number): JsonValue | undefined;
}

/**
 * Extracts the underlying type from a {@link Type} (it gets the `T` from `Type<T>`)
 * @public 
 */
export type TypeOf<T extends Type<unknown> | undefined> = T extends Type<infer V> ? V : never;

/**
 * Returns `true` if the specified value matches a predicate
 * @public 
 */
export type Predicate<T> = (value: T) => boolean;

const funcs: (keyof Type)[] = [
    "assert",
    "test",
    "restrict",
];

/**
 * Determines whether the specified value is a {@link Type}
 * @param value - The value to be checked
 * @returns `true` if the value is a {@link Type}; otherwise, `false`
 * @public
 */
export function isType(value: unknown): value is Type {
    return (
        _isRecord(value) &&
        funcs.every(key => key in value && typeof value[key] === "function")
    );
}