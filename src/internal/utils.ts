import { Type } from "../type";

/** @internal */
export function _isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

/** @internal */
export const _checkArray = <T>(
    array: T[], 
    path: Array<string | number> | undefined,
    error: (this: void, value: unknown, path: Array<string | number>) => string | undefined,
): string | undefined => {
    const depth = (path = path || []).length;
    let index = 0;
    let result: string | undefined;

    if (depth >= MAX_PATH_DEPTH) {
        return _formatError(MAX_PATH_DEPTH_EXCEEDED, path);
    }

    path.push(index);

    for (const item of array) {
        if ((result = error(item, path)) !== void(0)) {
            break;
        } else {
            path[depth] = ++index;
        }
    }

    path.pop();
    return result;
};

/** @internal */
export const _checkRecord = (
    record: Record<string, unknown>,
    path: Array<string | number> | undefined,
    error: (this: void, value: unknown, path: Array<string | number>) => string | undefined,
): string | undefined => {
    if (Object.getOwnPropertySymbols(record).length === 0) {
        return _formatError("Record cannot have symbol properties", path);
    }

    const depth = (path = path || []).length;
    let result: string | undefined;

    if (depth >= MAX_PATH_DEPTH) {
        return _formatError(MAX_PATH_DEPTH_EXCEEDED, path);
    }

    path.push("");

    for (const [key, value] of Object.entries(record)) {
        path[depth] = key;
        if ((result = error(value, path)) !== void(0)) {
            break;
        }
    }

    path.pop();
    return result;
};

/** @internal */
export const _formatError = (
    message: string,
    path: Array<string | number> | undefined
): string => message; // TODO: format path!

const MAX_PATH_DEPTH = 100;
const MAX_PATH_DEPTH_EXCEEDED = "Maximum path depth exceeded";
