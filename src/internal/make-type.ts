import { jsonValueType } from "../json";
import { PathArray } from "../path";
import { Type } from "../type";
import { _frozenType } from "./frozen";
import { _makeTypeError } from "./make-type-error";
import { _restrictType } from "./restrict";

/** @internal */
export const _makeType = <T>(options: TypeOptions<T>): Type<T> => {
    const {
        error,
        equals: _equals = Object.is,
        fromJsonValue = (value, makeError, path) => {
            type.assert(value, makeError, path);
            return value;
        },
        toJsonValue = (value, makeError, path) => {
            jsonValueType.assert(value, makeError, path);
            return value;
        },
    } = options;

    const assert: Type<T>["assert"] = (value, makeError = _makeTypeError, path) => {
        const message = error(value, path);
        if (message !== void(0)) {
            throw makeError(message);
        }
    };

    const frozen: Type<T>["frozen"] = () => _frozenType(type);

    function test(value: unknown, path?: PathArray): value is T {
        return error(value, path) === void(0);
    }    

    function equals(first: T, second: unknown): second is T {
        return _equals(first, second);
    }

    const restrict: Type<T>["restrict"] = (message, predicate) => _restrictType(type, message, predicate);

    const type: Type<T> = Object.freeze({ 
        assert,
        error,
        equals,
        fromJsonValue,
        frozen,
        restrict,
        test, 
        toJsonValue,
    });
    return type;
};

/** @internal */
export type TypeOptions<T = unknown> = (
    Pick<Type, "error"> & 
    Partial<Pick<Type<T>, "toJsonValue" | "fromJsonValue">> &
    { equals?: (this: void, first: T, second: unknown) => boolean; }
);
