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

    Object.defineProperty(freezing, "name", constructor.name);
    
    for (const proto of prototypeChain(freezing)) {
        Object.freeze(proto);
    }

    return freezing;
};

function *prototypeChain(ctor: unknown) {
    while (ctor) {
        yield ctor;
        ctor = Object.getPrototypeOf(ctor);
    }
}
