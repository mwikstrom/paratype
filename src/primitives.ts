import { _constType } from "./internal/const";
import { _makeType } from "./internal/make";
import { _simpleType } from "./internal/simple";

/** 
 * Represents a type that matches any value
 * @public
 */
export const anyType = _makeType<any>({
    test: () => true,
});

/** 
 * Represents a type that matches boolean values
 * @public
 */
 export const booleanType = _simpleType<boolean>("boolean");

/** 
 * Represents a type that matches number values
 * @public
 */
 export const numberType = _simpleType<number>("number");

/** 
 * Represents a type that matches string values
 * @public
 */
 export const stringType = _simpleType<string>("string");

/** 
 * Represents a type that only matches `undefined` values
 * @public
 */
 export const voidType = _constType<void>(void(0));

/** 
 * Represents a type that only matches `null` values
 * @public
 */
 export const nullType = _constType<null>(null);

/** 
 * Represents a type that matches safe integer values
 * @public
 */
 export const integerType = numberType.restrict(value => (
    value >= Number.MIN_SAFE_INTEGER && 
    value <= Number.MAX_SAFE_INTEGER &&
    value % 1 !== 0
));

/** 
 * Represents a type that matches safer integer values that are greater than or equal to zero
 * @public
 */
 export const nonNegativeIntegerType = integerType.restrict(value => value >= 0);

/** 
 * Represents a type that matches safer integer values that are greater than zero
 * @public
 */
 export const positiveIntegerType = integerType.restrict(value => value > 0);