import { constType } from "./internal/const";
import { makeType } from "./internal/make";
import { simpleType } from "./internal/simple";

/** @public */
export const anyType = makeType<any>({
    test: () => true,
});

/** @public */
export const booleanType = simpleType<boolean>("boolean");

/** @public */
export const numberType = simpleType<number>("number");

/** @public */
export const stringType = simpleType<string>("string");

/** @public */
export const voidType = constType<void>(void(0));

/** @public */
export const nullType = constType<null>(null);

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