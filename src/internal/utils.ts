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
): string => !path?.length ? message : `${_formatPath(path)}: ${message}`;

const _formatPath = (path: Array<string | number>) => path.reduce(
    (before, key) => (
        _isSafeArrayIndex(key) ?
            `${before}[${key}]` :
            _isSafePropertyName(key) ?
                before ? `${before}.${key}` : key :
                `${before}[${JSON.stringify(String(key))}]`
    ),
    "",
);

function _isSafeArrayIndex(key: string | number): key is number {
    return (
        typeof key === "number" &&
        key >= 0 &&
        key <= Number.MAX_SAFE_INTEGER
    );
}

function _isSafePropertyName(key: string | number): key is string {
    return (
        typeof key === "string" &&
        SAFE_PROPERTY_NAME_PATTERN.test(key)
    );
}

const MAX_PATH_DEPTH = 100;
const MAX_PATH_DEPTH_EXCEEDED = "Maximum path depth exceeded";
const SAFE_PROPERTY_NAME_PATTERN = /^[a-z_][a-z0-9_]*$/i;