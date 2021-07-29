import { Type } from "../type";
import { _formatError } from "./format-error";
import { _makeType } from "./make-type";

/** @internal */
export const _constType = <T>(fixed: T, message: string): Type<T> => _makeType({
    error: (value, path) => value === fixed ? void(0) : _formatError(message, path),
});
