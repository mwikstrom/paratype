import { Type } from "../type";
import { _restrictType } from "./restrict";

/** @internal */
export const _makeType = <T>(options: TypeOptions): Type<T> => {
    const { error } = options;
    const assert: Type<T>["assert"] = (value, path) => {
        const message = error(value, path);
        if (message !== void(0)) {
            throw new TypeError(message);
        }
    };
    function test(value: unknown, path?: Array<string | number>): value is T {
        return error(value, path) === void(0);
    }
    const restrict: Type<T>["restrict"] = (message, predicate) => _restrictType(type, message, predicate);
    const type: Type<T> = Object.freeze({ 
        assert,
        error,
        restrict,
        test, 
    });
    return type;
};

/** @internal */
export type TypeOptions = Pick<Type, "error">;
