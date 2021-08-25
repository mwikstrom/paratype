import { Type } from "../type";
import { _makeType } from "./make-type";
import { _formatError } from "./format-error";
import { _makeTypeError } from "./make-type-error";

/** @internal */
export const _frozenType = <T>(inner: Type<T>): Type<Readonly<T>> => {
    const error: Type["error"] = (value, path) => {
        let result = inner.error(value, path);
        if (result === void(0) && !Object.isFrozen(value)) {
            result = _formatError("Must be frozen", path);
        }
        return result;
    };

    const fromJsonValue: Type<T>["fromJsonValue"] = (value, makeError = _makeTypeError, path) => {
        const result = inner.fromJsonValue(value, makeError, path);
        return Object.freeze(result);
    };

    const toJsonValue: Type<T>["toJsonValue"] = inner.toJsonValue;

    return _makeType({ error, fromJsonValue, toJsonValue });
};