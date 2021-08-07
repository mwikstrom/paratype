import { PathArray } from "../path";
import { _formatError } from "./format-error";

/** @internal */
export const _checkPath = (path: PathArray): string | undefined => {
    if (path.length >= MAX_PATH_DEPTH) {
        return _formatError("Maximum path depth exceeded", path);
    }
};

/** @internal */
export const _assertPath = (path: PathArray | undefined): PathArray => {
    if (!path) {
        path = [];
    } else {
        const message = _checkPath(path);
        if (message !== void(0)) {
            throw new RangeError(message);
        }
    }
    return path;
};

const MAX_PATH_DEPTH = 100;
