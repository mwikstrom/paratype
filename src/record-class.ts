import { _isRecord } from "./internal/is-record";
import { RecordType } from "./record-type";

export type RecordClass<T> = {
    new (props: T): RecordInstance<T>;
};

export type RecordInstance<T> = (
    Readonly<T> &
    Omit<RecordInterface<T>, (Unsettable<T> extends never ? ("unmerge" | "unset") : never)>
);

export interface RecordInterface<T> {
    equals(other: unknown): boolean;
    get<K extends keyof T>(key: K): T[K];
    get(key: string): unknown | undefined;
    has<K extends keyof T>(key: K, value?: T[K]): boolean;
    has(key: string, value?: unknown): boolean;
    merge(props: Partial<T>): this;
    set<K extends keyof T>(key: K, value: T[K]): this;
    unmerge(props: Required<Pick<T, Unsettable<T>>>): this;
    unset(...keys: Unsettable<T>[]): this;
}

export type Unsettable<T> = { [K in keyof T]: T[K] extends undefined ? K : never }[keyof T];

export function Record<T>(type: RecordType<T>): RecordClass<T> {
    return class Record {
        #ctor: RecordClass<T>;
        #props: T & { [key: string]: unknown };
        
        constructor(props: T) {
            this.#ctor = this.constructor as RecordClass<T>;
            this.#props = type.pick(props);

            const error = type.error(this.#props);
            if (typeof error === "string") {
                throw new TypeError(`Invalid argument to record constructor: ${error}`);
            }

            const reserved = new Set(Object.keys(this));
            Object.assign(this, Object.fromEntries(Object.entries(this.#props).filter(([key]) => !reserved.has(key))));
        }
        
        equals = (other: T): boolean => {
            return type.equals(this.#props, type.pick(other));
        }

        get = (key: string): unknown | undefined => {
            return this.#props[key];
        }

        has = (key: string, value?: unknown): boolean => {
            if (!(key in this.#props)) {
                return false;
            }

            if (value === void(0)) {
                return true;
            }

            return !!type.getPropertyType(key)?.equals(this.#props[key], value);
        }

        merge = (props: Partial<T>): RecordInstance<T> => {
            return new this.#ctor({ ...this.#props, ...type.pick(props) });
        }

        set = (key: string, value: unknown): RecordInstance<T> => {
            const propType = type.getPropertyType(key);
            if (!propType) {
                throw new TypeError(`Cannot set unknown property: ${key}`);
            }
            
            const error = propType.error(value);
            if (typeof error === "string") {
                throw new TypeError(`Invalid value for property: ${key}: ${error}`);
            }

            return new this.#ctor({ ...this.#props, ...Object.fromEntries([[key, value]])});
        }

        unmerge = (props: Partial<T>): RecordInstance<T> => {
            const map = new Map(Object.entries(this.#props));

            for (const [key, value] of Object.entries(props)) {
                if (map.has(key)) {
                    const propType = type.getPropertyType(key);
                    if (propType?.equals(this.#props[key], value)) {
                        map.delete(key);
                    }
                }
            }

            return new this.#ctor(Object.fromEntries(map) as unknown as T);
        }

        unset = (...keys: string[]): RecordInstance<T> => {
            const map = new Map(Object.entries(this.#props));

            for (const key of keys) {
                if (!type.getPropertyType(key)) {
                    throw new TypeError(`Cannot unset unknown property: ${key}`);
                }
                
                if (!type.isOptional(key)) {
                    throw new TypeError(`Cannot unset required property: ${key}`);
                }

                map.delete(key);
            }

            return new this.#ctor(Object.fromEntries(map) as unknown as T);
        }
    } as unknown as RecordClass<T>;
}