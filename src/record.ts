import { _assertDepth, _assertPath } from "./internal/check-path";
import { _checkRecord } from "./internal/check-record";
import { _formatError } from "./internal/format-error";
import { _isRecord } from "./internal/is-record";
import { _makeType } from "./internal/make-type";
import { _makeTypeError } from "./internal/make-type-error";
import { JsonObject } from "./json";
import { PathArray } from "./path";
import { Type } from "./type";

/**
 * Constructs a {@link Type} that represents a record with the specified properties
 * @param properties - Properties of the record. Must be an object where keys provide property names,
 *                     and values their {@link Type}
 * @param options - <i>(Optional)</i> Provides record type behavior
 * @public
 */
export function recordType<T extends Record<string, unknown>, O extends (string & keyof T)[] = []>(
    properties: PropertyTypes<T, O>,
    options?: RecordOptions<O>,
): Type<WithRecordOptions<T, O>> {
    const props = new Map<string, Type<unknown>>(Object.entries(properties));
    const optional = new Set<string>(options?.optional || []);

    const checkMissing = (value: Record<string, unknown>, path?: PathArray): string | undefined => {
        for (const key of props.keys()) {
            if (!optional.has(key) && !(key in value)) {
                return _formatError(`Missing required property: ${key}`, path);
            }
        }
    };

    const error: Type["error"] = (value, path, shallow) => {
        if (!_isRecord(value)) {
            return _formatError("Must be a record object", path);
        }

        const missing = checkMissing(value, path);
        if (missing !== void(0)) {
            return missing;
        }

        return _checkRecord(value, path, shallow, (propValue, propPath) => {
            const propName = propPath.slice(-1)[0] as string;
            const propType = props.get(propName);
            return propType ?
                propType.error(propValue, propPath) :
                _formatError("Invalid property name", path);
        });
    };

    const fromJsonValue: Type<WithRecordOptions<T, O>>["fromJsonValue"] = (value, makeError = _makeTypeError, path) => {
        if (!_isRecord(value)) {
            throw makeError(_formatError("Must be a JSON object", path));
        }

        const missing = checkMissing(value, path);
        const result: Record<string, unknown> = {};
        if (missing !== void(0)) {
            throw makeError(missing);
        }

        const depth = (path = _assertPath(path)).length;
        path.push("");

        for (const [key, item] of Object.entries(value)) {
            const propType = props.get(key);
            path[depth] = key;
            if (!propType) {
                throw makeError(_formatError("Invalid property name", path));
            }
            const converted = propType.fromJsonValue(item, makeError, path);
            result[key] = converted;
        }

        path.pop();
        return result as WithRecordOptions<T, O>;
    };

    const toJsonValue: Type<WithRecordOptions<T, O>>["toJsonValue"] = (value, depth = 0) => {
        const result: JsonObject = {};
        _assertDepth(++depth);

        for (const [key, item] of Object.entries(value)) {
            const mapped = props.get(key)?.toJsonValue(item, depth);
            if (mapped === void(0)) {
                return void(0);
            }
            result[key] = mapped;
        }

        return result;
    };

    return _makeType<WithRecordOptions<T, O>>({ error, fromJsonValue, toJsonValue });
}

/**
 * Maps all properties to their corresponding run-time types
 * @public
 */
export type PropertyTypes<T extends Record<string, unknown>, O extends (string & keyof T)[] = []> = {
    [P in keyof T]-?: P extends O[number] ? Type<Exclude<T[P], undefined>> : Type<T[P]>;
};

/**
 * Specifies behavior for a record type
 * @public
 */
export interface RecordOptions<O extends string[] = []> {
    /** An array of property names that shall be optional (not required) in the record type */
    optional?: O;
    // TODO: Additional props
}

/**
 * Applies {@link RecordOptions} to a type
 * @public
 */
export type WithRecordOptions<T extends Record<string, unknown>, O extends (string & keyof T)[] = []> = {
    [P in Exclude<keyof T, O[number]>]-?: T[P];
} & {
    [P in O[number]]?: T[P];
}
