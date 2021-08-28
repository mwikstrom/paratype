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

    /**
     * Returns a copy of the current object with the specified properties merged in
     * 
     * @param props - The properties to merge
     * 
     * @remarks
     * Only properties that are supported by the current object are merged in, other
     * properties are ignored.
     */
    merge(props: Partial<T>): this;

    set<K extends keyof T>(key: K, value: T[K]): this;
    unmerge(props: Partial<Pick<T, Unsettable<T>>>): this;
    unset(...keys: Unsettable<T>[]): this;
}

export type Unsettable<T> = { [K in keyof T]: T[K] extends undefined ? K & string : never }[keyof T];

export function Record<T>(type: RecordType<T>): RecordClass<T> {
    return class Record implements RecordInterface<T> {
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

        #with(props: T): this {
            if (type.equals(this.#props, props)) {
                return this;
            } else {
                return new this.#ctor(props) as unknown as this;
            }
        }
        
        equals = (other: T): boolean => {
            return type.equals(this.#props, type.pick(other));
        }

        get = <K extends keyof T>(key: K): T[K] => {
            return this.#props[key];
        }

        has = <K extends keyof T>(key: K, value?: T[K]): boolean => {
            if (!(key in this.#props)) {
                return false;
            }

            if (value === void(0)) {
                return true;
            }

            return !!type.getPropertyType(key)?.equals(this.#props[key], value);
        }

        merge = (props: Partial<T>): this => {
            return this.#with({ ...this.#props, ...type.pick(props) });
        }

        set = <K extends keyof T>(key: K, value: T[K]): this => {
            const propType = type.getPropertyType(key);
            if (!propType) {
                throw new TypeError(`Cannot set unknown property: ${key}`);
            }
            
            const error = propType.error(value);
            if (typeof error === "string") {
                throw new TypeError(`Invalid value for property: ${key}: ${error}`);
            }

            return this.#with({ ...this.#props, ...Object.fromEntries([[key, value]])});
        }

        unmerge = (props: Partial<Pick<T, Unsettable<T>>>): this => {
            const map = new Map(Object.entries(this.#props));

            for (const [key, value] of Object.entries(props)) {
                if (map.has(key)) {
                    const propType = type.getPropertyType(key);
                    if (propType?.equals(this.#props[key], value)) {
                        map.delete(key);
                    }
                }
            }

            return this.#with(Object.fromEntries(map) as unknown as T);
        }

        unset = (...keys: Unsettable<T>[]): this => {
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

            return this.#with(Object.fromEntries(map) as unknown as T);
        }
    } as unknown as RecordClass<T>;
}
