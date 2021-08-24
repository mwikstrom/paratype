import { _formatError } from "./internal/format-error";
import { _isRecord } from "./internal/is-record";
import { _makeType } from "./internal/make-type";
import { _makeTypeError } from "./internal/make-type-error";
import { PathArray } from "./path";
import { Type, TypeOf } from "./type";

/**
 * Constructs a {@link Type} that represents a union of other types,
 * each with a common distriminator property.
 * @public
 **/
export function discriminatorType<
    Key extends string & keyof TypeOf<Union[keyof Union]>,
    Union extends Record<string, Type>,
>(
    key: Key,
    union: Union,
): Type<TypeOf<Union[keyof Union]>> {
    const select = (value: unknown, path?: PathArray): Type<TypeOf<Union[keyof Union]>> | string => {
        if (!_isRecord(value)) {
            return _formatError("Must be a record object", path);
        }

        if (!(key in value)) {
            return _formatError(`Missing required property: ${key}`, path);
        }

        const discriminator = value[key];
        if (!(typeof discriminator === "string") || !(discriminator in union)) {
            return _formatError("Unknown type", [...(path || []), key]);
        }

        return union[discriminator] as Type<TypeOf<Union[keyof Union]>>;
    };

    const error: Type["error"] = (value, path, shallow) => {
        if (!_isRecord(value)) {
            return _formatError("Must be a record object", path);
        }

        if (!(key in value)) {
            return _formatError(`Missing required property: ${key}`, path);
        }

        const discriminator = value[key];
        if (!(typeof discriminator === "string") || !(discriminator in union)) {
            return _formatError("Unknown type", [...(path || []), key]);
        }

        const type = select(value, path);
        return typeof type === "string" ? type : type.error(value, path, shallow);
    };

    const fromJsonValue: Type<TypeOf<Union[keyof Union]>>["fromJsonValue"] = (
        value, 
        makeError = _makeTypeError, 
        path,
    ) => {
        const type = select(value, path);
        if (typeof type === "string") {
            throw makeError(type);
        }
        return type.fromJsonValue(value, makeError, path);
    };

    const toJsonValue: Type<TypeOf<Union[keyof Union]>>["toJsonValue"] = (
        value, 
        makeError = _makeTypeError, 
        path,
    ) => {
        const type = select(value, path);
        if (typeof type === "string") {
            throw makeError(type);
        }
        return type.toJsonValue(value, makeError, path);
    };

    return _makeType<TypeOf<Union[keyof Union]>>({ error, fromJsonValue, toJsonValue });
}
