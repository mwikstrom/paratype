import { RecordType } from "./record-type";

/**
 * A constructor for record classes
 * @public
 */
export type RecordConstructor<Props> = {
    /**
     * Constructs a new instance with the specified properties.
     * 
     * @param props - The properties to assign.
     * 
     * @remarks
     * Only supported properties are assigned, other properties are ignored.
     */
    new(props: Props): Readonly<Props> & RecordObject<Props>;
};

/**
 * Methods implemented by {@link RecordConstructor} instances
 * @public
 */
export interface RecordObject<Props> {
    /**
     * Determines whether the specified object is equal to the current object.
     * 
     * @param other - The object to test for equality
     */
    equals(other: Readonly<Props>): boolean;

    /**
     * Gets the specified property value
     * 
     * @param key - Name of the property to get
     */
    get<K extends keyof Props>(key: K): Props[K];

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
    has<K extends keyof Props>(key: K, value?: Props[K]): boolean;

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
    merge(props: Partial<Props>): this;

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
    set<K extends keyof Props>(key: K, value: Props[K]): this;

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
    unmerge(props: Partial<Pick<Props, OptionalPropsOf<Props>>>): this;

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
    unset(...keys: OptionalPropsOf<Props>[]): this;
}

/**
 * Extracts optional properties from a type
 * @public
 */
export type OptionalPropsOf<T> = string & Exclude<{
    [K in keyof T]: T extends Record<K, T[K]> ? never : K
}[keyof T], undefined>;

/**
 * Returns a {@link RecordConstructor} for the specified record type
 * 
 * @param propsType - A record type that define properties for the returned class
 * 
 * @public
 */
export function RecordClass<Props>(propsType: RecordType<Props>): RecordConstructor<Props> {
    class Record implements RecordObject<Props> {
        #ctor: RecordConstructor<Props>;
        #props: Readonly<Props> & { readonly [key: string]: unknown };
        
        constructor(props: Props) {
            this.#ctor = this.constructor as RecordConstructor<Props>;
            this.#props = Object.freeze(propsType.pick(props));

            const error = propsType.error(this.#props);
            if (typeof error === "string") {
                throw new TypeError(`new ${this.#ctor.name}(...): Invalid argument: ${error}`);
            }

            const reserved = new Set(Object.getOwnPropertyNames(Record.prototype));
            Object.assign(this, Object.fromEntries(Object.entries(this.#props).filter(([key]) => !reserved.has(key))));
        }

        #with(props: Props): this {
            if (propsType.equals(this.#props, props)) {
                return this;
            } else {
                return new this.#ctor(props) as unknown as this;
            }
        }
        
        equals(other: Readonly<Props>): boolean {
            return Object.is(this, other) || propsType.equals(this.#props, propsType.pick(other));
        }

        get<K extends keyof Props>(key: K): Props[K] {
            return this.#props[key];
        }

        has<K extends keyof Props>(key: K, value?: Props[K]): boolean {
            if (this.#props[key] === void(0)) {
                return false;
            }

            if (value === void(0)) {
                return true;
            }

            return !!propsType.getPropertyType(key)?.equals(this.#props[key], value);
        }

        merge(props: Partial<Props>): this {
            return this.#with({ ...this.#props, ...propsType.pick(props) });
        }

        set<K extends keyof Props>(key: K, value: Props[K]): this {
            const propType = propsType.getPropertyType(key);
            if (!propType) {
                throw new TypeError(`Cannot set unknown property: ${key}`);
            }
            
            const error = propType.error(value);
            if (typeof error === "string") {
                throw new TypeError(`Invalid value for property: ${key}: ${error}`);
            }

            return this.#with({ ...this.#props, ...Object.fromEntries([[key, value]])});
        }

        unmerge(props: Partial<Pick<Props, OptionalPropsOf<Props>>>): this {
            const map = new Map(Object.entries(this.#props));

            for (const [key, value] of Object.entries(props)) {
                if (map.has(key)) {
                    const propType = propsType.getPropertyType(key);
                    if (propType?.equals(this.#props[key], value)) {
                        map.delete(key);
                    }
                }
            }

            return this.#with(Object.fromEntries(map) as unknown as Props);
        }

        unset(...keys: OptionalPropsOf<Props>[]): this {
            const map = new Map(Object.entries(this.#props));

            for (const key of keys) {
                if (!propsType.getPropertyType(key)) {
                    throw new TypeError(`Cannot unset unknown property: ${key}`);
                }
                
                if (!propsType.isOptional(key)) {
                    throw new TypeError(`Cannot unset required property: ${key}`);
                }

                map.delete(key);
            }

            return this.#with(Object.fromEntries(map) as unknown as Props);
        }
    }

    return Record as unknown as RecordConstructor<Props>;
}
