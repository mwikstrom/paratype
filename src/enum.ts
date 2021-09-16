import { _formatError } from "./internal/format-error";
import { _makeType } from "./internal/make-type";
import { Type } from "./type";

/**
 * Constructs a {@link Type} that represents an enumeration of the specified values.
 * @param values - Allowed values of the new enum type
 * @public
 **/
export function enumType<V extends string>(values: readonly V[]): Type<V> {
    const error: Type<string>["error"] = (value, path) => {
        if (typeof value === "string" && values.includes(value as V)) {
            return void(0);
        } else {
            const message = `Must be one of: ${values.map(item => `"${item}"`).join(" | ")}`;
            return _formatError(message, path);
        }
    };

    return _makeType({ error });
}
