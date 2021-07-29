import { _checkRecord } from "./internal/check-record";
import { _formatError } from "./internal/format-error";
import { _isRecord } from "./internal/is-record";
import { _makeType } from "./internal/make-type";
import { JsonObject } from "./json";
import { Type } from "./type";

/**
 * Constructs a {@link Type} that represents a record with the specified properties
 * @param properties - Properties of the record. Must be an object where keys provide property names,
 *                     and values their {@link Type}
 * @param options - <i>(Optional)</i> Provides record type behavior
 * @public
 */
export function recordType<T extends Record<string, unknown>, O extends (string & keyof T) | never = never>(
    properties: PropertyTypes<T, O>,
    options?: RecordOptions<O>,
): Type<T> {
    const props = new Map(Object.entries(properties));
    const optional = new Set<string>(options?.optional || []);

    const error: Type["error"] = (value, path, shallow) => {
        if (!_isRecord(value)) {
            return _formatError("Must be a record object", path);
        }

        for (const key of props.keys()) {
            if (!optional.has(key) && !(key in value)) {
                return _formatError(`Missing required property: ${key}`, path);
            }
        }        

        return _checkRecord(value, path, shallow, (propValue, propPath) => {
            const propName = propPath.slice(-1)[0] as string;
            const propType = props.get(propName);
            return propType ?
                propType.error(propValue, propPath) :
                _formatError("Invalid property name", path);
        });
    };

    const toJsonValue: Type<T>["toJsonValue"] = value => {
        const result: JsonObject = {};

        for (const [key, item] of Object.entries(value)) {
            const mapped = props.get(key)?.toJsonValue(item);
            if (mapped === void(0)) {
                return void(0);
            }
            result[key] = mapped;
        }

        return result;
    };

    return _makeType({ error, toJsonValue });
}

/**
 * Maps all properties to their corresponding run-time types
 * @public
 */
export type PropertyTypes<T extends Record<string, unknown>, O extends (keyof T) | never = never> = {
    [P in keyof T]-?: P extends O ? Type<Exclude<T[P], undefined>> : Type<T[P]>;
};

/**
 * Specifies behavior for a record type
 * @public
 */
export interface RecordOptions<O extends string | never = never> {
    /** An array of property names that shall be optional (not required) in the record type */
    optional?: O[];
    // TODO: Additional props
}
