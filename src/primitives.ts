import { _constType } from "./internal/const";
import { _makeType } from "./internal/make";
import { _simpleType } from "./internal/simple";

/** 
 * Matches any value
 * @public
 */
export const anyType = _makeType<unknown>({
    test: () => true,
});

/** 
 * Matches boolean values
 * @public
 */
export const booleanType = _simpleType<boolean>("boolean");

/** 
 * Matches number values
 * @public
 */
export const numberType = _simpleType<number>("number");

/** 
 * Matches string values
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
 * Matches safe integer values
 * @public
 */
export const integerType = numberType.restrict(value => (
    value >= Number.MIN_SAFE_INTEGER && 
    value <= Number.MAX_SAFE_INTEGER &&
    value % 1 !== 0
));

/** 
 * Matches safe integer values that are greater than or equal to zero
 * @public
 */
export const nonNegativeIntegerType = integerType.restrict(value => value >= 0);

/** 
 * Matches safe integer values that are greater than zero
 * @public
 */
export const positiveIntegerType = integerType.restrict(value => value > 0);