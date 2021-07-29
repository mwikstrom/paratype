/**
 * A run-time type
 * @public
 */
export interface Type<T = any> {
    /**
     * Asserts that the specified value matches the current run-time type.
     * A `TypeError` is thrown in case the value doesn't match.
     * @param this - <i>(Ignored)</i> This method uses implicit `this` binding
     * @param value - The value to be checked
     */
    assert(this: void, value: any): asserts value is T;

    /**
     * Determines whether the specified value matches the current run-time type.
     * @param this - <i>(Ignored)</i> This method uses implicit `this` binding
     * @param value - The value to be checked
     * @returns `true` if the value matches; otherwise, `false`
     */
    test(this: void, value: any): value is T;

    /**
     * Constructs a new {@link Type} that represents a restriction of the current run-time type.
     * @param this - <i>(Ignored)</i> This method uses implicit `this` binding
     * @param predicate - A predicate that represents the restriction
     */
    restrict(this: void, predicate: Predicate<T>): Type<T>;
}

/**
 * Extracts the underlying type from a {@link Type} (it gets the `T` from `Type<T>`)
 * @public 
 */
export type TypeOf<T extends Type<any> | undefined> = T extends Type<infer V> ? V : never;

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
export function isType(value: any): value is Type {
    return (
        !!value &&
        typeof value === "object" &&
        funcs.every(key => key in value && typeof value[key] === "function")
    );
}