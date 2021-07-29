import { makeType } from "./make";

/** @internal */
export const constType = <T>(fixed: T) => makeType({
    test: value => value === fixed,
});
