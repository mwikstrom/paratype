import { makeType } from "./internal/make";
import { Type } from "./type";

/** @public */
export const arrayType = <T>(items: Type<T>) => makeType({
    test: value => Array.isArray(value) && value.every(items.test),
});
