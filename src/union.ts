import { _makeType } from "./internal/make-type";
import { Type, TypeOf } from "./type";

/**
 * Constructs a {@link Type} that represents a union of other types.
 * @public
 **/
export function unionType<T extends Type<unknown>[]>(...types: T): Type<TypeOf<T[number]>> {
    const error: Type["error"] = (...args) => {
        const mapped = types.map(t => t.error(...args)).filter(msg => msg !== void(0));
        if (mapped.length === 0) {
            return void(0);
        }
        return "(" + mapped.join(" -or- ") + ")";
    };

    const equals = (first: TypeOf<T[number]>, second: unknown): boolean => (
        types.some(t => t.test(first) && t.equals(first, second))
    );

    const firstSuccessful = <Result>(func: (t: Type<TypeOf<T[number]>>) => Result) => {
        let error: Error | undefined;
        for (const t of types) {
            try {
                return func(t as Type<TypeOf<T[number]>>);
            } catch (failed) {
                error = failed;
            }
        }
        throw error;
    };

    const fromJsonValue: Type<TypeOf<T[number]>>["fromJsonValue"] = (...args) => (
        firstSuccessful(t => t.fromJsonValue(...args))
    );

    const toJsonValue: Type<TypeOf<T[number]>>["toJsonValue"] = (...args) => (
        firstSuccessful(t => t.toJsonValue(...args))
    );

    return _makeType({ error, equals, fromJsonValue, toJsonValue });
}
