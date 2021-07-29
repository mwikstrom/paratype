import { Type } from "../type";
import { _makeType } from "./make";

/** @internal */
export const _simpleType = <T>(typename: string): Type<T> => _makeType<T>({
    test: value => typeof value === typename,
});
