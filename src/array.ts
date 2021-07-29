import { _makeType } from "./internal/make";
import { Type } from "./type";

/** @public */
export function arrayType<T>(items: Type<T>): Type<T[]> {
    const test = (value: any) => Array.isArray(value) && value.every(items.test);
    return _makeType({ test });
}
