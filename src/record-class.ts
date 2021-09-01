import { customClassType, Equatable } from "./class";
import { lazyType } from "./lazy";
import { RecordType } from "./record-type";
import { Type } from "./type";

/**
 * A constructor for record classes
 * @public
 */
export type RecordConstructor<Props, Data = Props> = {
    /**
     * Constructs a new instance with the specified properties.
     * 
     * @param input - The input that provide the properties to assign.
     * 
     * @remarks
     * Only supported properties are assigned, other properties are ignored.
     */
    new(input: Props | Data): Readonly<Props> & RecordObject<Props, Data>;

    /**
     * The run-time type for record properties
     */
    readonly propsType: RecordType<Props>;

    /**
     * The run-time type for record data
     */
    readonly dataType: Type<Data>;
};

/**
 * Methods implemented by {@link RecordConstructor} instances
 * @public
 */
export interface RecordObject<Props, Data = Props> {
    /**
     * Determines whether the specified value is equal to the current object.
     * 
     * @param value - The value to test for equality
     */
    equals(value: Props | Data): boolean;

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
     * Extracts data from the current object
     */
    toData(): Data;

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
 * Creates a run-time type for a record class
 * @public
 */
export function recordClassType<
    T extends RecordObject<Props, Data> & Equatable & Readonly<Props>, 
    Props, 
    Data,
>(
    lazy: () => RecordConstructor<Props, Data> & { new (input: Props | Data): T }
): Type<T> {
    return lazyType<T>(() => {
        const target = lazy();
        const { dataType: { fromJsonValue, toJsonValue } } = target;
        return customClassType<T, [Props | Data]>(
            target,
            (...args) => new target(fromJsonValue(...args)) as unknown as T,
            (value, ...rest) => toJsonValue(value.toData(), ...rest),
        );
    });
}

/**
 * Returns a {@link RecordConstructor} for the specified record type
 * 
 * @param propsType - A record type that define properties for the returned class
 * 
 * @public
 */
export function RecordClass<Props>(propsType: RecordType<Props>): RecordConstructor<Props>;

/**
 * Returns a {@link RecordConstructor} for the specified record type and data conversion
 * 
 * @param propsType - A record type that define properties for the returned class
 * @param dataType - Run-time data type
 * @param dataToProps - A function that convert data to properties
 * @param propsToData - A function that convert properties to data
 * 
 * @public
 */
export function RecordClass<Props, Data>(
    propsType: RecordType<Props>,
    dataType: Type<Data>,
    dataToProps: (data: Data) => Props,
    propsToData: (props: Props) => Data,
): RecordConstructor<Props, Data>;

export function RecordClass<Props, Data = Props>(
    propsType: RecordType<Props>,
    dataType: Type<Data> = propsType as unknown as Type<Data>,
    dataToProps: (data: Data) => Props = data => data as unknown as Props,
    propsToData: (props: Props) => Data = props => props as unknown as Data,
): RecordConstructor<Props, Data> {
    class Record implements RecordObject<Props, Data> {
        static readonly propsType: RecordType<Props> = propsType;
        static readonly dataType: Type<Data> = dataType;

        #ctor: RecordConstructor<Props, Data>;
        #props: Readonly<Props> & { readonly [key: string]: unknown };
        
        constructor(input: Props | Data) {
            this.#ctor = this.constructor as RecordConstructor<Props, Data>;
            this.#props = Object.freeze(
                !Object.is(propsType, dataType) && dataType.test(input) ?
                    dataToProps(input) :
                    propsType.pick(input) as Props
            );

            const error = propsType.error(this.#props);
            if (typeof error === "string") {
                throw new TypeError(`new ${this.#ctor.name}(...): Invalid argument: ${error}`);
            }

            const reserved = new Set(Object.keys(this));
            Object.assign(this, Object.fromEntries(Object.entries(this.#props).filter(([key]) => !reserved.has(key))));
        }

        #with(props: Props): this {
            if (propsType.equals(this.#props, props)) {
                return this;
            } else {
                return new this.#ctor(props) as unknown as this;
            }
        }
        
        equals = (value: Props | Data): boolean => {
            return Object.is(this, value) || propsType.equals(
                this.#props, propsType.pick(
                    Object.is(propsType, dataType) || !dataType.test(value) ? value as Props : dataToProps(value)
                )
            );
        }

        get = <K extends keyof Props>(key: K): Props[K] => {
            return this.#props[key];
        }

        has = <K extends keyof Props>(key: K, value?: Props[K]): boolean => {
            if (this.#props[key] === void(0)) {
                return false;
            }

            if (value === void(0)) {
                return true;
            }

            return !!propsType.getPropertyType(key)?.equals(this.#props[key], value);
        }

        merge = (props: Partial<Props>): this => {
            return this.#with({ ...this.#props, ...propsType.pick(props) });
        }

        set = <K extends keyof Props>(key: K, value: Props[K]): this => {
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

        toData = () => propsToData(this.#props);

        unmerge = (props: Partial<Pick<Props, OptionalPropsOf<Props>>>): this => {
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

        unset = (...keys: OptionalPropsOf<Props>[]): this => {
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

    return Record as unknown as RecordConstructor<Props, Data>;
}
