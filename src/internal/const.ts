import { _makeType } from "./make";

/** @internal */
export const _constType = <T>(fixed: T) => _makeType({
    test: value => value === fixed,
});
