import { Predicate, Type } from "../type";
import { _makeType } from "./make";

/** @internal */
export const _restrictType = <T>(inner: Type<T>, predicate: Predicate<T>): Type<T> => {
    const test = (value: any) => inner.test(value) && predicate(value);
    return _makeType({ test });
};