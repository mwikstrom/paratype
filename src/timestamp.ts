import { _formatError } from "./internal/format-error";
import { _makeType } from "./internal/make-type";
import { _makeTypeError } from "./internal/make-type-error";
import { Type } from "./type";

const error: Type<Date>["error"] = (value, path) => (
    !(value instanceof Date) || toJsonValue(value) === void(0) ?
        _formatError(ERROR_MESSAGE, path) :
        void(0)
);

const fromJsonValue: Type<Date>["fromJsonValue"] = (value, makeError = _makeTypeError, path) => {
    if (typeof value !== "string" || !STRICT_PATTERN.test(value)) {
        throw makeError(_formatError(ERROR_MESSAGE, path));
    } else {
        return new Date(value);
    }
};

const toJsonValue: Type<Date>["toJsonValue"] = value => {
    const str = value.toISOString();
    return STRICT_PATTERN.test(str) ? str : void(0);
};

/**
 * Matches timestamp values
 * @public
 */
export const timestampType = _makeType<Date>({
    error,
    fromJsonValue,
    toJsonValue,
});

const ERROR_MESSAGE = "Must be a timestamp";
const STRICT_PATTERN = /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{3}Z$/;
