## API Report File for "paratype"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

// @public (undocumented)
export const anyType: Type<any>;

// @public (undocumented)
export const arrayType: <T>(items: Type<T>) => Type<unknown>;

// @public (undocumented)
export const booleanType: Type<boolean>;

// @public (undocumented)
export const integerType: Type<number>;

// @public (undocumented)
export const nonNegativeIntegerType: Type<number>;

// @public (undocumented)
export const nullType: Type<unknown>;

// @public (undocumented)
export const numberType: Type<number>;

// @public (undocumented)
export const positiveIntegerType: Type<number>;

// @public (undocumented)
export interface RecordOptions<O> {
    // (undocumented)
    optional?: O;
}

// @public (undocumented)
export type RecordProperties<T extends Record<string, Type<any>>, O extends (keyof T)[]> = ({
    [P in Exclude<keyof T, O[number]>]: TypeOf<T[P]>;
} & {
    [P in O[number]]?: TypeOf<T[P]>;
});

// @public (undocumented)
export const recordType: <P extends Record<string, Type<any>>, O extends (keyof P)[] = []>(properties: P, options?: RecordOptions<O>) => Type<RecordProperties<P, O>>;

// @public (undocumented)
export const stringType: Type<string>;

// @public (undocumented)
export interface Type<T> {
    // (undocumented)
    and<U>(this: void, other: Type<U>): Type<T & U>;
    // (undocumented)
    assert(this: void, value: any): asserts value is T;
    // (undocumented)
    or<U>(this: void, other: Type<U>): Type<T | U>;
    // (undocumented)
    restrict(this: void, predicate: (value: T) => boolean): Type<T>;
    // (undocumented)
    test(this: void, value: any): value is T;
}

// @public (undocumented)
export type TypeOf<T extends Type<any> | undefined> = T extends Type<infer V> ? V : never;

// @public (undocumented)
export const voidType: Type<unknown>;

// (No @packageDocumentation comment for this package)

```