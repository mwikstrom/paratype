import { Type } from "../type";
import { _makeType } from "./make";
import { _formatError } from "./utils";

/** @internal */
export const _simpleType = <T>(typename: "boolean" | "string" | "number"): Type<T> => _makeType<T>({
    error: (value, path) => typeof value === typename ? void(0) : _formatError(`Must be a ${typename}`, path)
});
