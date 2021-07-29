import { Predicate, Type } from "../type";
import { _restrictType } from "./restrict";

/** @internal */
export const _makeType = <T>(options: TypeOptions<T>): Type<T> => {
    const { test: _test } = options;
    const test = _test as TypeGuard<T>;
    const assert = (value: any) => {
        if (!test(value)) {
            throw new TypeError();
        }
    };
    const restrict = (predicate: Predicate<T>) => _restrictType(type, predicate);
    const type: Type<T> = Object.freeze({ 
        test, 
        assert,
        restrict,
    });
    return type;
}

/** @internal */
export type TypeGuard<T> = (this: void, value: any) => value is T;

/** @internal */
export interface TypeOptions<T> {
    test(this: void, value: any): boolean;
}
