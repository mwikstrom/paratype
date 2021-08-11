import { PathArray } from "../path";
import { ConversionContext } from "../type";
import { _formatError } from "./format-error";

/** @internal */
export const _checkPath = (path: PathArray): string | undefined => {
    if (path.length >= MAX_PATH_DEPTH) {
        return _formatError("Maximum path depth exceeded", path);
    }
};

/** @internal */
export const _assertPath = (context: ConversionContext): PathArray => {
    if (!context.path) {
        return context.path = [];
    }

    const message = _checkPath(context.path);
    if (message !== void(0)) {
        throw new RangeError(message);
    }

    return context.path;
};

const MAX_PATH_DEPTH = 100;
