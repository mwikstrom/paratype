import { _constType } from "./internal/const";
import { _makeType } from "./internal/make-type";
import { _simpleType } from "./internal/simple";

/** 
 * Matches any value
 * @public
 */
export const anyType = _makeType<unknown>({
    error: () => void(0)
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
export const voidType = _constType<void>(void(0), "Must be undefined");

/** 
 * Represents a type that only matches `null` values
 * @public
 */
export const nullType = _constType<null>(null, "Must be null");

/** 
 * Matches safe integer values
 * @public
 */
export const integerType = numberType.restrict(
    "Must be a safe integer",
    Number.isSafeInteger,
);

/** 
 * Matches safe integer values that are greater than or equal to zero
 * @public
 */
export const nonNegativeIntegerType = integerType.restrict(
    "Must be greater or equal to zero",
    value => value >= 0,
);

/** 
 * Matches safe integer values that are greater than zero
 * @public
 */
export const positiveIntegerType = integerType.restrict(
    "Must be greater than zero",
    value => value > 0,
);