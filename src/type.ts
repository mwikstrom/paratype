import { _isRecord } from "./internal/is-record";

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
    assert(this: void, value: unknown, path?: Array<string | number>): asserts value is T;

    /**
     * Returns an error message when the specified value doesn't match the current run-time type,
     * and otherwise `undefined`.
     * @param this - <i>(Ignored)</i> This method uses implicit `this` binding
     * @param value - The value to be checked
     * @param path - <i>(Optional)</i> Path to the value
     * @param shallow - <i>(Optiona)</i> When `true` errors from array items or record properties are ignored
     */
    error(this: void, value: unknown, path?: Array<string | number>, shallow?: boolean): string | undefined;

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
     test(this: void, value: unknown, path?: Array<string | number>): value is T;
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