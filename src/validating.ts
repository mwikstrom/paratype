import "reflect-metadata";
import { Type } from "./type";

/**
 * A parameter decorator to be used in combination with the {@link validating} class
 * decorator to automatically validate that the parameter matches the specified run-time type.
 * 
 * @param type - The run-time type that parameter values shall be validated against
 * @public
 */
export function type(type: Type<unknown>): ParameterTypeDecorator {
    return (target, propertyKey, parameterIndex) => registerValidator(target, propertyKey, parameterIndex, type);
}

/**
 * A parameter decorator to be used in combination with the {@link validating} class
 * decorator to automatically validate that the each rest parameter matches the specified run-time type.
 * 
 * @param type - The run-time type that parameter values shall be validated against
 * @public
 */
export function restType(type: Type<unknown>): ParameterTypeDecorator {
    return (target, propertyKey, parameterIndex) => registerValidator(target, propertyKey, ~parameterIndex, type);
}

/**
 * A class decorator that enables parameter validation and this bindings in all functions.
 * @param constructor - The class to be decorated
 * @public
 */
export function validating<T extends ValidationTarget>(constructor: T): T {
    for (const instance of [true, false]) {        
        const target = instance ? constructor.prototype : constructor;
        
        for (const propertyKey of getOwnPropertyNamesAndSymbols(target)) {
            if (propertyKey === "constructor") {
                continue;
            }
            const descriptor = Object.getOwnPropertyDescriptor(target, propertyKey);
            if (typeof descriptor?.value !== "function") {
                continue;
            }
            const validator = getParameterValidator(target, propertyKey);
            if (!validator && !instance) {
                continue;
            }
            const original = descriptor.value;
            let signature = typeof propertyKey === "symbol" ? 
                `${constructor.name}[${propertyKey.description || "[symbol]"}]` :
                `${constructor.name}.${propertyKey}`;
            if (!instance) {
                signature = "static " + signature;
            }
            signature += "(...)";
            const replacement = function (this: unknown, ...args: unknown[]) {
                if (instance && !(this instanceof constructor)) {
                    throw new TypeError(`${signature}: Invalid this binding`);
                }
                if (validator) {
                    validator(args, signature);
                }
                return original.apply(this, args);
            };
            Object.defineProperty(target, propertyKey, { value: replacement });
        }
    }

    const maybe = getParameterValidator(constructor, "constructor");
    if (!maybe) {
        return constructor;
    }

    const validator = maybe; // HACK: Just to make TS happy
    return class extends constructor {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        constructor(...args: any[]) {
            super(...args);
            validator(args, `new ${constructor.name}(...)`);
        }
    };
}

/**
 * Signature for a parameter type decorator
 * @public
 */
export type ParameterTypeDecorator = (
    target: ValidationTarget, 
    propertyKey: string | symbol | undefined,
    parameterIndex: number
) => void;

/**
 * Alias for a class to be decorated
 * @public
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ValidationTarget = { new (...args: any[]): any };

const METAKEY = Symbol();

type ParameterValidator = (
    paramArray: unknown[],
    signature?: string,
) => void;

const getParameterValidator = (
    target: ValidationTarget,
    propertyKey: string | symbol,
): ParameterValidator | undefined => Reflect.getOwnMetadata(METAKEY, target, propertyKey);

const registerValidator = (
    target: ValidationTarget, 
    propertyKey: string | symbol = "constructor",
    parameterIndex: number,
    type: Type<unknown>,
): void => {
    const prev = Reflect.getOwnMetadata(METAKEY, target, propertyKey) as ParameterValidator;
    const next: ParameterValidator = (paramArray, ...rest) => {
        if (prev) {
            prev(paramArray, ...rest);
        }
        if (parameterIndex < 0) {
            for (let index = ~parameterIndex; index < paramArray.length; ++index) {
                verify(type, index, paramArray, ...rest);
            }
        } else {
            verify(type, parameterIndex, paramArray, ...rest);
        }
    };        
    Reflect.defineMetadata(METAKEY, next, target, propertyKey);
};

const verify = (type: Type<unknown>, index: number, paramArray: unknown[], signature?: string): void => {
    const error = type.error(paramArray[index]);
    if (error !== void(0)) {
        let message = signature ? `${signature}: ` : "";
        message += `Argument #${index}: ${error}`;
        throw new TypeError(message);
    }
};

const getOwnPropertyNamesAndSymbols = (target: ValidationTarget): (string | symbol)[] => ([
    ...Object.getOwnPropertyNames(target),
    ...Object.getOwnPropertySymbols(target),
]);
