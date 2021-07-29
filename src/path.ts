/** 
 * An array of string and/or numbers that represents the path of a value
 * @public
 */
export type PathArray = Array<string | number>;

/**
 * Returns a string that represents the specified value path
 * @param path - The path to the formatted
 * @public
 */
export function formatPath(path: PathArray): string {
    return path.reduce<string>(
        (before, key) => (
            _isSafeArrayIndex(key) ?
                `${before}[${key}]` :
                _isSafePropertyName(key) ?
                    before ? `${before}.${key}` : String(key) :
                    `${before}[${JSON.stringify(String(key))}]`
        ),
        "",
    );
}

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
