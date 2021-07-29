import { jsonValueType } from "../json";
import { PathArray } from "../path";
import { Type } from "../type";
import { _restrictType } from "./restrict";

/** @internal */
export const _makeType = <T>(options: TypeOptions<T>): Type<T> => {
    const {
        error,
        fromJsonValue = (value, path) => {
            type.assert(value, path);
            return value;
        },
        toJsonValue = value => jsonValueType.test(value) ? value : void(0),
    } = options;

    const assert: Type<T>["assert"] = (value, path) => {
        const message = error(value, path);
        if (message !== void(0)) {
            throw new TypeError(message);
        }
    };

    function test(value: unknown, path?: PathArray): value is T {
        return error(value, path) === void(0);
    }

    const restrict: Type<T>["restrict"] = (message, predicate) => _restrictType(type, message, predicate);

    const type: Type<T> = Object.freeze({ 
        assert,
        error,
        fromJsonValue,
        restrict,
        test, 
        toJsonValue,
    });
    return type;
};

/** @internal */
export type TypeOptions<T = unknown> = (
    Pick<Type, "error"> & 
    Partial<Pick<Type<T>, "toJsonValue" | "fromJsonValue">>
);
