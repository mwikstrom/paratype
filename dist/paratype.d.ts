/** @public */
export declare const anyType: Type<any>;

/** @public */
export declare const arrayType: <T>(items: Type<T>) => Type<unknown>;

/** @public */
export declare const booleanType: Type<boolean>;

/** @public */
export declare const integerType: Type<number>;

/** @public */
export declare const nonNegativeIntegerType: Type<number>;

/** @public */
export declare const nullType: Type<unknown>;

/** @public */
export declare const numberType: Type<number>;

/** @public */
export declare const positiveIntegerType: Type<number>;

/** @public */
export declare interface RecordOptions<O> {
    optional?: O;
}

/** @public */
export declare type RecordProperties<T extends Record<string, Type<any>>, O extends (keyof T)[]> = ({
    [P in Exclude<keyof T, O[number]>]: TypeOf<T[P]>;
} & {
    [P in O[number]]?: TypeOf<T[P]>;
});

/** @public */
export declare const recordType: <P extends Record<string, Type<any>>, O extends (keyof P)[] = []>(properties: P, options?: RecordOptions<O>) => Type<RecordProperties<P, O>>;

/** @public */
export declare const stringType: Type<string>;

/** @public */
export declare interface Type<T> {
    assert(this: void, value: any): asserts value is T;
    test(this: void, value: any): value is T;
    restrict(this: void, predicate: (value: T) => boolean): Type<T>;
    or<U>(this: void, other: Type<U>): Type<T | U>;
    and<U>(this: void, other: Type<U>): Type<T & U>;
}

/** @public */
export declare type TypeOf<T extends Type<any> | undefined> = T extends Type<infer V> ? V : never;

/** @public */
export declare const voidType: Type<unknown>;

export { }
