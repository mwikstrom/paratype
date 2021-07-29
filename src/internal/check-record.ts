import { PathArray } from "../path";
import { _checkPath } from "./check-path";
import { _formatError } from "./format-error";

/** @internal */
export const _checkRecord = (
    record: Record<string, unknown>,
    path: PathArray | undefined,
    shallow: boolean | undefined,
    error: (this: void, value: unknown, path: PathArray) => string | undefined,
): string | undefined => {
    if (Object.getOwnPropertySymbols(record).length) {
        return _formatError("Record cannot have symbol properties", path);
    } else if (shallow) {
        return void(0);
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
