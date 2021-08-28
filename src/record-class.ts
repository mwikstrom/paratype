import { RecordType } from "./record-type";

/**
 * A class that act as wrapper for record properties
 * @public
 */
export type RecordClass<T> = {
    /**
     * Constructs a new instance with the specified properties.
     * 
     * @param props - The properties to assign
     * 
     * @remarks
     * Only supported properties are assigned, other properties are ignored.
     */
    new(props: T): RecordMethods<T> & Readonly<T>;
};

/**
 * Methods implemented by {@link RecordClass} instances
 * @public
 */
export declare class RecordMethods<T> {
    /**
     * Determines whether the current object is equal to another object, by comparing
     * their properties.
     * 
     * @param other - The object to test for equality
     */
    equals(other: unknown): boolean;

    /**
     * Gets the specified property value
     * 
     * @param key - Name of the property to get
     */
    get<K extends keyof T>(key: K): T[K];

    /**
     * Gets the specified property value
     * 
     * @param key - Name of the property to get
     */
    get(key: string): unknown | undefined;

    /**
     * Determines whether the current object has the specified property
     * 
     * @param key - Name of the property to test
     * @param value - Optionally specifies a value that shall be tested for equality
     */
    has<K extends keyof T>(key: K, value?: T[K]): boolean;

    /**
     * Determines whether the current object has the specified property
     * 
     * @param key - Name of the property to test
     * @param value - Optionally specifies a value that shall be tested for equality
     */
    has(key: string, value?: unknown): boolean;

    /**
     * Returns a copy of the current object with the specified properties merged in
     * 
     * @param props - The properties to merge
     * 
     * @remarks
     * Only properties that are supported by the current object are merged in, other
     * properties are ignored.
     * 
     * If the resulting object would be equal to the current instance, then the current
     * instance is returned instead.
     */
    merge(props: Partial<T>): this;

    /**
     * Returns a copy of the current object with the specified property merged in
     * 
     * @param key - Key of the property to merge in
     * @param value - Property value to merge in
     * 
     * @remarks
     * If the resulting object would be equal to the current instance, then the current
     * instance is returned instead.
     */
    set<K extends keyof T>(key: K, value: T[K]): this;

    /**
     * Returns a copy of the current object with the specified properties merged out
     * 
     * @param props - The properties to unmerge
     * 
     * @remarks
     * Only properties that are supported by the current object and have equal values
     * with the current object are unmerged, other properties are ignored.
     * 
     * If the resulting object would be equal to the current instance, then the current
     * instance is returned instead.
     */
    unmerge(props: Partial<Pick<T, Unsettable<T>>>): this;

    /**
     * Returns a copy of the current object without the specified properties
     * 
     * @param keys - Name of properties that shall be removed
     * 
     * @remarks
     * Only optional properties can be unset.
     * 
     * If the resulting object would be equal to the current instance, then the current
     * instance is returned instead.
     */
    unset(...keys: Unsettable<T>[]): this;
}

/**
 * Extracts unsettable properties from a type
 * @public
 */
export type Unsettable<T> = string & Exclude<{
    [K in keyof T]: T extends Record<K, T[K]> ? never : K
}[keyof T], undefined>;

/**
 * Returns a {@link RecordClass} for the specified record type
 * 
 * @param type - A record type that define properties for the returned class
 * 
 * @public
 */
export function Record<T>(type: RecordType<T>): RecordClass<T> {
    return class Record implements RecordMethods<T> {
        #ctor: RecordClass<T>;
        #props: T & { [key: string]: unknown };
        
        constructor(props: T) {
            this.#ctor = this.constructor as RecordClass<T>;
            this.#props = type.pick(props);

            const error = type.error(this.#props);
            if (typeof error === "string") {
                throw new TypeError(`new ${this.#ctor.name}(...): Invalid argument: ${error}`);
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
            return Object.is(this, other) || type.equals(this.#props, type.pick(other));
        }

        get = <K extends keyof T>(key: K): T[K] => {
            return this.#props[key];
        }

        has = <K extends keyof T>(key: K, value?: T[K]): boolean => {
            if (this.#props[key] === void(0)) {
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
