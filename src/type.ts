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
     * An error is thrown in case the value doesn't match.
     * @param this - <i>(Ignored)</i> This method uses implicit `this` binding
     * @param value - The value to be checked
     * @param error - <i>(Optional)</i> A callback that is invoked to construct the error to be 
     *               thrown when value doesn't match
     * @param path - <i>(Optional)</i> Path to the value
     */
    assert(this: void, value: unknown, error?: ErrorCallback, path?: PathArray): asserts value is T;

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
     * Determines whether the specified values are equal according to the current run-time type.
     * @param this - <i>(Ignored)</i> This method uses implicit `this` binding
     * @param first - The first value to test for equality. 
     *                It is assumed that this values matches the current run-time type.
     * @param second - The second value to test for equality.
     *                 This value does not have to match the current run-time type.
     */
    equals(this: void, first: T, second: unknown): second is T;

    /**
     * Converts the specified JSON value to a value that matches the current run-time type.
     * An error is thrown in case conversion is unsuccessful.
     * @param this - <i>(Ignored)</i> This method uses implicit `this` binding
     * @param value - The value to be converted
     * @param error - <i>(Optional)</i> A callback that is invoked to construct the error to be 
     *               thrown when conversion is unsuccessful
     * @param path - <i>(Optional)</i> Path to the value
     */
    fromJsonValue(this: void, value: JsonValue, error?: ErrorCallback, path?: PathArray): T;

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
     * @param error - <i>(Optional)</i> A callback that is invoked to construct the error to be 
     *               thrown when conversion is unsuccessful
     * @param path - <i>(Optional)</i> Path to the value
     */
    toJsonValue(this: void, value: T, error?: ErrorCallback, path?: PathArray): JsonValue;
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

/**
 * A callback that, given a message, creates an error
 * @public
 */
export type ErrorCallback = (message: string) => Error;

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