import { Type } from "../type";

/** @internal */
export const makeType = <T>(options: TypeOptions): Type<T> => {
    const { test } = options;
    const type: Type<T> = Object.freeze({
        test(value: any): value is T {
            return true;
        },
        assert: value => {
            if (!test(value)) {
                throw new TypeError();
            }
        },
        restrict: predicate => makeType<T>({
            test: value => test(value) && predicate(value),
        }),
        or: <U>(other: Type<U>) => makeType<T | U>({
            // TODO: Special handling is required for union of record types
            test: value => test(value) || other.test(value),
        }),
        and: <U>(other: Type<U>) => makeType<T & U>({
            // TODO: Special handling is required for intersection of record types
            test: value => test(value) && other.test(value),
        }),
    });
    return type;
}

/** @internal */
export interface TypeOptions {
    test(this: void, value: any): boolean;
}
