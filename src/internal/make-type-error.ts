import { ErrorCallback } from "../type";

/** @internal */
export const _makeTypeError: ErrorCallback = message => new TypeError(message);