/** @public */
export interface Type<T = any> {
    assert(this: void, value: any): asserts value is T;
    test(this: void, value: any): value is T;
    restrict(this: void, predicate: Predicate<T>): Type<T>;
}

/** @public */
export type TypeOf<T extends Type<any> | undefined> = T extends Type<infer V> ? V : never;

/** @public */
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