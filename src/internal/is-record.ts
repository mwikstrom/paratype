/** @internal */
export function _isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}
