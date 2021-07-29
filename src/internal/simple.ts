import { makeType } from "./make";

/** @internal */
export const simpleType = <T>(typename: string) => makeType<T>({
    test: value => typeof value === typename,
});
