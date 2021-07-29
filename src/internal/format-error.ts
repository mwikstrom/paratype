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

const SAFE_PROPERTY_NAME_PATTERN = /^[a-z_][a-z0-9_]*$/i;
