/** @public */
export interface Type<T> {
    assert(this: void, value: any): asserts value is T;
    test(this: void, value: any): value is T;
    restrict(this: void, predicate: (value: T) => boolean): Type<T>;
    or<U>(this: void, other: Type<U>): Type<T | U>;
    and<U>(this: void, other: Type<U>): Type<T & U>;
    // TODO: except
}

/** @public */
export type TypeOf<T extends Type<any> | undefined> = T extends Type<infer V> ? V : never;