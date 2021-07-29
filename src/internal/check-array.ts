import { PathArray } from "../path";
import { _checkPath } from "./check-path";

/** @internal */
export const _checkArray = <T>(
    array: T[], 
    path: PathArray | undefined,
    error: (this: void, value: unknown, path: PathArray) => string | undefined,
): string | undefined => {
    const depth = (path = path || []).length;
    let index = 0;
    let result = _checkPath(path);

    if (result === void(0)) {
        path.push(index);

        for (const item of array) {
            if ((result = error(item, path)) !== void(0)) {
                break;
            } else {
                path[depth] = ++index;
            }
        }

        path.pop();
    }

    return result;
};
