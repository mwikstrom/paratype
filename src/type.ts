/** @public */
export interface Type<T> {
    assert(this: void, value: any): asserts value is T;
    test(this: void, value: any): value is T;
    restrict(this: void, predicate: Predicate<T>): Type<T>;
}

/** @public */
export type TypeOf<T extends Type<any> | undefined> = T extends Type<infer V> ? V : never;

/** @public */
export type Predicate<T> = (value: T) => boolean;
