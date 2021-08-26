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
    return customClassType(ctor, ctor.fromJsonValue, (value, ...rest) => value.toJsonValue(...rest));
}

/** 
 * Matches instances of a specific class and uses custom conversion callbacks
 * @public
 */
export function customClassType<T extends Partial<Equatable>, Args extends unknown[] = unknown[]>(
    ctor: {new (...args: Args): T },
    fromJsonValue: (this: void, value: JsonValue, error?: ErrorCallback, path?: PathArray) => T,
    toJsonValue: (this: void, value: T, error?: ErrorCallback, path?: PathArray) => JsonValue,
): Type<T> {
    return _makeType({
        error: (value, path) => (
            value instanceof ctor ? 
                void(0) :
                _formatError(`Must be an instance of ${ctor.name}`, path)
        ),
        equals: (first, second) => typeof first.equals === "function" ? first.equals(second) : first === second,
        fromJsonValue,
        toJsonValue,
    });
}

/**
 * The static interface of type classes
 * @public
 */
export interface TypeClass<I extends TypeInstance> {
    new (...args: unknown[]): I;
    fromJsonValue(this: void, value: JsonValue, error?: ErrorCallback, path?: PathArray): I;
}

/**
 * The interface of type class instances
 * @public
 */
export interface TypeInstance extends Partial<Equatable> {
    toJsonValue(error?: ErrorCallback, path?: PathArray): JsonValue;
}

/**
 * Implements equality
 * @public
 */
export interface Equatable {
    equals(other: unknown): boolean;
}
