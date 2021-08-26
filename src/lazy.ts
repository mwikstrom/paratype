import { _makeType } from "./internal/make-type";
import { Type } from "./type";

/**
 * Constructs a late bound {@link Type}.
 * @public
 **/
export function lazyType<T>(init: () => Type<T>): Type<T> {
    let resolved: Type<T> | undefined;
    const resolve = () => {
        if (!resolved) {
            resolved = init();
        }
        return resolved;
    };
    return _makeType({ 
        error: (...args) => resolve().error(...args),
        equals: (...args) => resolve().equals(...args),
        fromJsonValue: (...args) => resolve().fromJsonValue(...args),
        toJsonValue: (...args) => resolve().toJsonValue(...args),
    });
}
