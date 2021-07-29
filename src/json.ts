import { _makeType } from "./internal/make";
import { Predicate } from "./type";

/**
 * A JSON value
 * @public
 */
export type JsonValue = JsonPrimitive | JsonArray | JsonObject;

/**
 * One of the JSON primitive types
 * @public
 */
export type JsonPrimitive = string | number | boolean | null;

/**
 * An array of JSON values
 * @public 
 */
export type JsonArray = Array<JsonValue>;

/**
 * An object where keys are strings and values are JSON values
 * @public
 */
// This can't be a type alias because it would be a type reference loop
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface JsonObject extends Record<string, JsonValue> { }

const testPrimitive: Predicate<unknown> = (value: unknown) => (
    typeof value === "string" ||
    typeof value === "boolean" ||
    value === null ||
    (
        typeof value === "number" &&
        isFinite(value)
    )
);

const test = (value: unknown, stack?: Set<unknown>) => {
    if (testPrimitive(value)) {
        return true;
    }

    if (!stack) {
        stack = new Set();
    } else if (stack.has(value)) {
        return true;
    }

    stack.add(value);
    
    const nested: Predicate<unknown> = child => test(child, stack);
    const result = (
        (
            Array.isArray(value) && 
            value.every(nested)
        ) ||
        (
            typeof value === "object" &&
            Object.getOwnPropertySymbols(value).length === 0 &&
            // implicit null assertion because null would have matched as primitive (tested above)
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            Object.values(value!).every(nested)
        )
    );

    stack.delete(value);
    return result;
};

/**
 * Matches JSON values
 * @public
 */
export const jsonValueType = _makeType<JsonValue>({
    test,
});
