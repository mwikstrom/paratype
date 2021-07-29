import { Predicate, Type } from "../type";
import { _makeType } from "./make-type";
import { _formatError } from "./format-error";

/** @internal */
export const _restrictType = <T>(inner: Type<T>, message: string, predicate: Predicate<T>): Type<T> => {
    const error: Type["error"] = (value, path) => {
        let result = inner.error(value, path);
        if (result === void(0) && !predicate(value as T)) {
            result = _formatError(message, path);
        }
        return result;
    };
    return _makeType({ error });
};