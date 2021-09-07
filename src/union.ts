import { _makeType } from "./internal/make-type";
import { _makeTypeError } from "./internal/make-type-error";
import { ErrorCallback, Type, TypeOf } from "./type";

/**
 * Constructs a {@link Type} that represents a union of other types.
 * @public
 **/
export function unionType<T extends Type<unknown>[]>(...types: T): Type<TypeOf<T[number]>> {
    const join = (errors: (string | undefined)[]): string | undefined => {
        const filtered = Array.from(new Set(errors.filter(msg => msg !== void(0))));
        if (filtered.length === 1) {
            return filtered[0];
        } else if (filtered.length > 1) {
            return filtered.join(" -or- ");
        }
    };

    const error: Type["error"] = (...args) => {
        const errors: string[] = [];
        for (const t of types) {
            const e = t.error(...args);
            if (e === void(0)) {
                return e;
            }
            errors.push(e);
        }
        return join(errors);
    };

    const equals = (first: TypeOf<T[number]>, second: unknown): boolean => (
        types.some(t => t.test(first) && t.equals(first, second))
    );

    const firstSuccessful = <Result>(
        func: (t: Type<TypeOf<T[number]>>) => Result,
        makeError: ErrorCallback = _makeTypeError,
    ) => {
        const errors: (string | undefined)[] = [];
        for (const t of types) {
            try {
                return func(t as Type<TypeOf<T[number]>>);
            } catch (e) {
                if (e instanceof Error) {
                    errors.push(e.message);
                }
            }
        }
        throw makeError(join(errors) ?? "Union type error");
    };

    const fromJsonValue: Type<TypeOf<T[number]>>["fromJsonValue"] = (...args) => (
        firstSuccessful(t => t.fromJsonValue(...args), args[1])
    );

    const toJsonValue: Type<TypeOf<T[number]>>["toJsonValue"] = (...args) => (
        firstSuccessful(t => t.toJsonValue(...args), args[1])
    );

    return _makeType({ error, equals, fromJsonValue, toJsonValue });
}
