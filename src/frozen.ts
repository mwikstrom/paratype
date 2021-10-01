/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Freezes the decorated class, its base classes, and all instances of the class.
 * @param constructor - The decorated class
 * @public
 */
export const frozen = <T extends { new (...args: any[]): any }>(constructor: T): T => {
    const freezing = class extends constructor {
        constructor(...args: any[]) {
            super(...args);
            Object.freeze(this);
        }
    };

    Object.defineProperty(freezing, "name", { value: constructor.name });
    
    for (const proto of prototypeChain(freezing)) {
        if (!dontFreeze.has(proto)) {
            Object.freeze(proto);
        }
    }

    return freezing;
};

function *prototypeChain(ctor: { new (...args: any[]): any }) {
    while (ctor) {
        yield ctor;
        yield ctor.prototype;
        ctor = Object.getPrototypeOf(ctor);
    }
}

const dontFreeze = new Set([
    Object,
    Object.prototype,
]);
