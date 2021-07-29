import { Type } from "../type";
import { _makeType } from "./make-type";
import { _formatError } from "./format-error";

/** @internal */
export const _simpleType = <T>(typename: "boolean" | "string" | "number"): Type<T> => _makeType<T>({
    error: (value, path) => typeof value === typename ? void(0) : _formatError(`Must be a ${typename}`, path)
});
