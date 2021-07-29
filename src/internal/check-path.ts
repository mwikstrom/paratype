import { PathArray } from "../path";
import { _formatError } from "./format-error";

/** @internal */
export const _checkPath = (path: PathArray): string | undefined => {
    if (path.length >= MAX_PATH_DEPTH) {
        return _formatError("Maximum path depth exceeded", path);
    }
};

const MAX_PATH_DEPTH = 100;
