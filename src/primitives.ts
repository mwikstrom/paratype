import { _constType } from "./internal/const";
import { _makeType } from "./internal/make";
import { _simpleType } from "./internal/simple";

/** @public */
export const anyType = _makeType<any>({
    test: () => true,
});

/** @public */
export const booleanType = _simpleType<boolean>("boolean");

/** @public */
export const numberType = _simpleType<number>("number");

/** @public */
export const stringType = _simpleType<string>("string");

/** @public */
export const voidType = _constType<void>(void(0));

/** @public */
export const nullType = _constType<null>(null);

/** @public */
export const integerType = numberType.restrict(value => (
    value >= Number.MIN_SAFE_INTEGER && 
    value <= Number.MAX_SAFE_INTEGER &&
    value % 1 !== 0
));

/** @public */
export const nonNegativeIntegerType = integerType.restrict(value => value >= 0);

/** @public */
export const positiveIntegerType = integerType.restrict(value => value > 0);