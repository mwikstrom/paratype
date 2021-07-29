import { _checkPath } from "./check-path";
import { _formatError } from "./format-error";

/** @internal */
export const _checkRecord = (
    record: Record<string, unknown>,
    path: Array<string | number> | undefined,
    error: (this: void, value: unknown, path: Array<string | number>) => string | undefined,
): string | undefined => {
    if (Object.getOwnPropertySymbols(record).length) {
        return _formatError("Record cannot have symbol properties", path);
    }

    const depth = (path = path || []).length;
    let result = _checkPath(path);

    if (result === void(0)) {
        path.push("");

        for (const [key, value] of Object.entries(record)) {
            path[depth] = key;
            if ((result = error(value, path)) !== void(0)) {
                break;
            }
        }

        path.pop();
    }

    return result;
};
