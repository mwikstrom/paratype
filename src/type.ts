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

/** @public */
export function isType(this: void, thing: any): thing is Type {
    return (
        !!thing &&
        typeof thing === "object" &&
        funcs.every(key => key in thing && typeof thing[key] === "function")
    );
}