import { _formatError } from "./internal/format-error";
import { _makeType } from "./internal/make-type";
import { JsonValue } from "./json";
import { PathArray } from "./path";
import { ErrorCallback, Type } from "./type";

/** 
 * Matches instances of a specific class
 * @public
 */
export function classType<T extends TypeClass<I>, I extends TypeInstance>(ctor: T): Type<I> {
    return _makeType({
        error: (value, path) => (
            value instanceof ctor ? 
                void(0) :
                _formatError(`Must be an instance of ${ctor.name}`, path)
        ),
        fromJsonValue: ctor.fromJsonValue,
        toJsonValue: (value, error, path) => value.toJsonValue(error, path),
    });
}

/**
 * The static interface of type classes
 * @public
 */
export interface TypeClass<I extends TypeInstance> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    new (...args: any): I;
    fromJsonValue(this: void, value: JsonValue, error?: ErrorCallback, path?: PathArray): I;
}

/**
 * The interface of type class instances
 * @public
 */
export interface TypeInstance {
    toJsonValue(error?: ErrorCallback, path?: PathArray): JsonValue;
}
