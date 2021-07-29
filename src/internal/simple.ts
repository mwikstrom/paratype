import { _makeType } from "./make";

/** @internal */
export const _simpleType = <T>(typename: string) => _makeType<T>({
    test: value => typeof value === typename,
});
