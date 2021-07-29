import { makeType } from "./internal/make";
import { Type, TypeOf } from "./type";

/** @public */
export const recordType = <P extends Record<string, Type<any>>, O extends (keyof P)[] = []>(
    properties: P,
    options: RecordOptions<O> = {},
): Type<RecordProperties<P, O>> => {
    const props = new Map(Object.entries(properties));
    const optional = new Set(options.optional || []);
    return makeType({
        test: value => {
            if (!value || typeof value !== "object") {
                return false;
            }
    
            for (const key of props.keys()) {
                if (!optional.has(key) && !(key in value)) {
                    return false;
                }
            }
    
            for (const [key, item] of Object.entries(value)) {
                const type = props.get(key);
                if (!type || !type.test(item)) {
                    return false;
                }
            }
    
            return true;
        },
    })
};

/** @public */
export type RecordProperties<T extends Record<string, Type<any>>, O extends (keyof T)[]> = (
    {[P in Exclude<keyof T, O[number]>]: TypeOf<T[P]>} &
    {[P in O[number]]?: TypeOf<T[P]>}
);

/** @public */
export interface RecordOptions<O> {
    optional?: O;
    // TODO: Additional props
}
