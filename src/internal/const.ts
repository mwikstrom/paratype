import { Type } from "../type";
import { _makeType } from "./make";

/** @internal */
export const _constType = <T>(fixed: T): Type<T> => _makeType({
    test: value => value === fixed,
});
